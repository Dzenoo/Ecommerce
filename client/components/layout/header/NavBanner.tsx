import React from 'react';

import { BadgeHelp, Truck } from 'lucide-react';

import { renderIconText } from '@/helpers';

const NavBanner: React.FC = () => {
  const NavBannerIcons = [
    {
      id: 1,
      icon: <BadgeHelp color="#008ECC" />,
      text: 'Online Support',
    },
    {
      id: 2,
      icon: <Truck color="#008ECC" />,
      text: 'Fast delivery (1 - 3 days)',
    },
  ];

  return (
    <div className="base-padding bg-[#F5F5F5] py-2 flex items-center justify-between gap-5">
      <div>
        <h2 className="text-muted-foreground font-light">
          Welcome to DzenvoShop!
        </h2>
      </div>
      <div className="flex items-center gap-10">
        {NavBannerIcons.map((item) => renderIconText(item, { p: 'text-sm' }))}
      </div>
    </div>
  );
};

export default NavBanner;
