type Props = {
  children: React.ReactNode
}

const AppLayout = ({ children }: Props) => {
  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-50">
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
            BeautyBiz Insights
          </h1>

          <p className="text-xs text-slate-400 text-right max-w-xs leading-snug">
            This dashboard uses the 
            <a 
              href="https://fakestoreapi.com/docs" 
              target="_blank" 
              rel="noreferrer"
              className="text-indigo-400 underline mx-1"
            >
              Fake Store API
            </a>
            for demonstration. Historical order data is mostly from early–mid&nbsp;2020, 
            so some date ranges may not display results.
          </p>

        </div>
      </header>

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {children}
      </main>
    </div>
  )
}

export default AppLayout
