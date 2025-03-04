import ProfileNavigation from '@/components/user/profile/ProfileNavigation';

const ProfileLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grid grid-cols-[0.4fr,2fr] gap-5 pt-5 max-lg:grid-cols-1 max-lg:gap-10">
      <div>
        <ProfileNavigation />
      </div>
      <div>{children}</div>
    </div>
  );
};

export default ProfileLayout;
