import React from 'react';

const HomePage = () => {
  return (
    <article>
      <div className="h-full w-full rounded-lg bg-gradient-to-br from-[#0c39b3] via-[#02fcfc8c] to-indigo-700 shadow-lg">
        <div className="flex flex-col rounded-xl p-6 backdrop-brightness-75">
          <h1 className="text-xl font-semibold text-white">
            Find and explore clothes that match your style.
          </h1>
          <div className="mt-2 max-w-lg">
            <p className="text-white">
              DzenvoShop is a clothing store that offers a wide range of
              clothing products to suit different styles and preferences.
            </p>
          </div>
        </div>
      </div>
    </article>
  );
};

export default HomePage;
