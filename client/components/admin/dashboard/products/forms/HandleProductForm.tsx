'use client';

import React from 'react';

import { CATEGORY_LIST } from '@/constants';

import PickCategory from './PickCategory';

const HandleProductForm: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = React.useState<number | null>(
    null,
  );

  const handleCategorySelect = (category: any) => {
    setSelectedCategory(category.id);
  };

  return (
    <div>
      <PickCategory
        categories={CATEGORY_LIST}
        selectedCategory={selectedCategory}
        onSelect={handleCategorySelect}
      />
    </div>
  );
};

export default HandleProductForm;
