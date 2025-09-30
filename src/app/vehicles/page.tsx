'use client';

import VehiclesSection from '../../components/features/VehiclesSection';

export default function VehiclesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <VehiclesSection showAllOption={true} removeTopPadding={true} hideCallToAction={true} enablePagination={true} showLogo={true} />
    </div>
  );
}
