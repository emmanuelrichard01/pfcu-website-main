
import React from 'react';

const EventsLoading = () => {
  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pfcu-purple"></div>
      </div>
    </div>
  );
};

export default EventsLoading;
