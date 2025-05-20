
import React from 'react';
import DictationExercise from './DictationExercise';

const DictationSection: React.FC = () => {
  return (
    <div className="py-8">
      <h2 className="text-3xl font-bold text-center mb-8">Ejercicios de Dictado</h2>
      <div className="kid-container">
        <DictationExercise />
      </div>
    </div>
  );
};

export default DictationSection;
