import React from "react";

const Footer = () => {
  return (
    <footer className="text-gray-600 bg-white border-t border-emerald-100">
      <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Main Grid Setup */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand Section - Takes full width on mobile/tablet, 1 column on desktop */}
          <div className="space-y-4 sm:col-span-2 md:col-span-1">
            <div className="flex items-center">
              <img src="/logo.png" alt="Logo" className="w-auto h-8" />
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-gray-500">
              Building fresh, modern, and sustainable digital experiences.
            </p>
          </div>

          {/* Links Wrapper: Automatically forces 2 columns when width becomes short (sm screens) */}
          <div className="grid grid-cols-2 gap-8 sm:col-span-2 md:col-span-2">
            {/* Column 1: Links */}
            <div>
              <h3 className="mb-4 text-sm font-semibold tracking-wider uppercase text-emerald-800">
                Solutions
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#marketing"
                    className="transition-colors hover:text-emerald-600"
                  >
                    Marketing
                  </a>
                </li>
                <li>
                  <a
                    href="#analytics"
                    className="transition-colors hover:text-emerald-600"
                  >
                    Analytics
                  </a>
                </li>
                <li>
                  <a
                    href="#commerce"
                    className="transition-colors hover:text-emerald-600"
                  >
                    Commerce
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 2: Links */}
            <div>
              <h3 className="mb-4 text-sm font-semibold tracking-wider uppercase text-emerald-800">
                Support
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#pricing"
                    className="transition-colors hover:text-emerald-600"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#docs"
                    className="transition-colors hover:text-emerald-600"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="#guides"
                    className="transition-colors hover:text-emerald-600"
                  >
                    Guides
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Column 3: Newsletter - Full width on mobile/tablet, 1 column on desktop */}
          <div className="sm:col-span-2 md:col-span-1">
            <h3 className="mb-4 text-sm font-semibold tracking-wider uppercase text-emerald-800">
              Stay Updated
            </h3>
            <form className="flex w-full max-w-md mt-2">
              <input
                type="email"
                required
                placeholder="Enter your email"
                className="w-full min-w-0 px-4 py-2 text-sm border border-emerald-200 rounded-l-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white transition-colors shrink-0 bg-emerald-600 rounded-r-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-4 pt-8 mt-12 text-xs text-center text-gray-400 border-t border-emerald-100 sm:flex-row sm:gap-0 sm:text-left">
          <p>
            &copy; {new Date().getFullYear()} EmeraldInc. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a
              href="#privacy"
              className="transition-colors hover:text-emerald-600"
            >
              Privacy Policy
            </a>
            <a
              href="#terms"
              className="transition-colors hover:text-emerald-600"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
