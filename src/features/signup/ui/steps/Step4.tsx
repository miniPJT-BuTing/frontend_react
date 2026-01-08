import React from 'react';
import FaceAnalyze from '../parts/FaceAnalyze';
import AnimalPicker from '../parts/AnimalPicker';

export default function Step4Avator() {
  return (
    <div className="flex flex-col gap-8">
      <FaceAnalyze />
      <AnimalPicker />
    </div>
  );
}