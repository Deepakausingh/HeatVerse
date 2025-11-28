import React from 'react';

export default function Footer(){
  return (
    <footer className="bg-transparent mt-8 border-t pt-4">
      <div className="container mx-auto text-center text-sm text-gray-500">
        © {new Date().getFullYear()} VelvetVibes. All rights reserved.
      </div>
    </footer>
  );
}
