export function Footer() {
  return (
    <footer className="bg-slate-800 dark:bg-slate-900 text-white py-8 px-6">
      <div className="container mx-auto text-center">
        <div className="mb-4">
          <h3 className="text-2xl font-bold mb-2">Patoekipa</h3>
          <p className="text-slate-300">
            Grupa przyjaciół z dzieciństwa w IT
          </p>
        </div>
        
        <div className="border-t border-slate-700 pt-4">
          <p className="text-slate-400 text-sm">
            © {new Date().getFullYear()} Patoekipa. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
} 