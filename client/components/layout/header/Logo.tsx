import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Logo: React.FC<{ href?: string }> = ({ href = '/' }) => {
  return (
    <Link className="w-fit" href={href}>
      <Image
        className="min-w-[150px]"
        src="/images/logo-dark.png"
        alt="logo"
        width={150}
        height={150}
        loading="lazy"
      />
    </Link>
  );
};

export default Logo;
