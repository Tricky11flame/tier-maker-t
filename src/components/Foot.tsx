function Foot() {
    return (
      <footer className="bg-neutral-800 clerk text-white px-4 py-2 shadow-md flex justify-between items-center ">
        {/* Footer content can go here */}
        <div className="text-sm opacity-80">
          &copy; {new Date().getFullYear()} My Tier Board. All rights reserved.
        </div>
        <div className="flex items-center gap-4">
          {/* Example: Social media icons or links */}
          <a href="#" className="text-white hover:text-blue-400">Privacy Policy</a>
          <span className="text-white">|</span>
          <a href="#" className="text-white hover:text-blue-400">Terms of Service</a>
        </div>
      </footer>
    );
  }
  
  export default Foot;