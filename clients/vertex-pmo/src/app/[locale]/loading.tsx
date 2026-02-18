export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 rounded-full border-4 border-cream-400" />
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-sage-500" />
        </div>
        <p className="text-sm font-medium text-taupe animate-pulse">
          Chargement&hellip;
        </p>
      </div>
    </div>
  );
}
