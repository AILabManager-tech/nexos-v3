"""Tests for nexos.pipeline_config — dynamic pipeline resolution."""

import tempfile
from pathlib import Path

from nexos.pipeline_config import PHASES_CREATE, PipelineConfig


class TestPipelineConfigFromBrief:
    def test_default_create_mode(self):
        cfg = PipelineConfig.from_brief(None, "create")
        assert cfg.phases == PHASES_CREATE
        assert cfg.stack == "nextjs"
        assert cfg.site_type == "vitrine"

    def test_audit_mode(self):
        cfg = PipelineConfig.from_brief(None, "audit")
        assert cfg.phases == ["ph5-qa"]

    def test_modify_mode(self):
        cfg = PipelineConfig.from_brief(None, "modify")
        assert cfg.phases == ["site-update"]

    def test_content_mode(self):
        cfg = PipelineConfig.from_brief(None, "content")
        assert cfg.phases == ["ph3-content"]

    def test_analyze_mode(self):
        cfg = PipelineConfig.from_brief(None, "analyze")
        assert cfg.phases == ["ph0-discovery"]

    def test_brief_with_stack(self):
        """Stack and type come from site object (canonical brief-schema.json format)."""
        brief = {"site": {"stack": "nuxt", "type": "ecommerce", "pages": ["home"]}}
        cfg = PipelineConfig.from_brief(brief, "create")
        assert cfg.stack == "nuxt"
        assert cfg.site_type == "ecommerce"

    def test_brief_without_stack_defaults(self):
        """Brief with site but no stack defaults to nextjs."""
        brief = {"site": {"type": "blog", "pages": ["home"]}}
        cfg = PipelineConfig.from_brief(brief, "create")
        assert cfg.stack == "nextjs"
        assert cfg.site_type == "blog"

    def test_unknown_mode_fallback(self):
        cfg = PipelineConfig.from_brief(None, "unknown_mode")
        assert cfg.phases == PHASES_CREATE  # Fallback to create


class TestTemplateDir:
    def test_stack_specific_dir(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            root = Path(tmpdir)
            (root / "templates" / "nextjs").mkdir(parents=True)
            cfg = PipelineConfig.from_brief(None, "create", nexos_root=root)
            assert cfg.template_dir == root / "templates" / "nextjs"

    def test_generic_fallback(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            root = Path(tmpdir)
            (root / "templates" / "generic").mkdir(parents=True)
            brief = {"site": {"stack": "unknown", "type": "vitrine", "pages": ["home"]}}
            cfg = PipelineConfig.from_brief(brief, "create", nexos_root=root)
            assert cfg.template_dir == root / "templates" / "generic"

    def test_flat_legacy_fallback(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            root = Path(tmpdir)
            (root / "templates").mkdir()
            cfg = PipelineConfig.from_brief(None, "create", nexos_root=root)
            assert cfg.template_dir == root / "templates"

    def test_get_template_dir_static(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            root = Path(tmpdir)
            (root / "templates" / "nextjs").mkdir(parents=True)
            result = PipelineConfig.get_template_dir(root, "nextjs")
            assert result == root / "templates" / "nextjs"
