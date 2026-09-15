export default function MapPage() {
  return (
    <div className="h-[calc(100vh-200px)] flex items-center justify-center" style={{ backgroundColor: 'var(--off-white)' }}>
      <div className="text-center">
        <h1 className="text-2xl font-extrabold mb-2" style={{ color: 'var(--navy)' }}>
          Equipment Map
        </h1>
        <p className="text-sm" style={{ color: 'var(--slate)' }}>
          Mapbox integration will be implemented here
        </p>
      </div>
    </div>
  );
}