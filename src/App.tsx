import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function App() {
  const [started, setStarted] = useState(false)

  const handleStartSearch = () => {
    setStarted(true)
  }

  return (
    <div className="mx-auto max-w-[1600px] px-lg py-2xl bg-dominant min-h-screen flex flex-col">
      {/* Header */}
      <header className="mb-2xl">
        <h1 className="text-title font-weight-bold text-primary-text leading-tight">
          Search Engine Lab
        </h1>
        <p className="text-body text-muted-text mt-xs">
          See how a query becomes a ranked list, one step at a time.
        </p>
      </header>

      {/* Main Grid */}
      <main className="grid grid-cols-[minmax(300px,28fr)_minmax(280px,24fr)_minmax(480px,48fr)] gap-md items-start flex-grow">
        
        {/* Left Panel: Search inputs */}
        <section 
          aria-label="Search inputs" 
          className="bg-secondary border border-border-custom rounded-[12px] p-lg flex flex-col gap-xl"
        >
          <h2 className="text-heading font-weight-bold text-primary-text">Inputs</h2>
          <div className="flex flex-col gap-sm">
            <label className="text-label text-primary-text font-weight-bold">Scenario</label>
            <div className="p-md bg-subtle-surface border border-border-custom rounded-[8px] text-body text-muted-text">
              Default Scenario
            </div>
          </div>

          <div className="flex flex-col gap-sm">
            <label className="text-label text-primary-text font-weight-bold">Query</label>
            <div className="p-md bg-subtle-surface border border-border-custom rounded-[8px] text-body text-muted-text">
              iphone
            </div>
          </div>

          <div className="flex flex-col gap-sm">
            <label className="text-label text-primary-text font-weight-bold">Documents</label>
            <Card className="border-border-custom bg-secondary shadow-none rounded-[8px]">
              <CardHeader className="p-md pb-xs">
                <CardTitle className="text-label text-primary-text">Document 1</CardTitle>
              </CardHeader>
              <CardContent className="p-md pt-0 text-body text-muted-text">
                iphone 12 pro max
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Center Panel: Lesson steps */}
        <section 
          aria-label="Lesson steps" 
          className="bg-secondary border border-border-custom rounded-[12px] p-lg flex flex-col gap-xl min-h-[300px]"
        >
          {!started ? (
            <div className="flex flex-col gap-xl flex-grow justify-between">
              <div className="flex flex-col gap-md">
                <h2 className="text-heading font-weight-bold text-primary-text">Start your lesson</h2>
                <p className="text-body text-muted-text">
                  Choose a scenario on the left, then click Start Search to begin.
                </p>
              </div>
              <Button 
                onClick={handleStartSearch}
                className="w-full min-h-[44px] bg-accent-fill hover:bg-accent-fill/90 text-accent-contrast font-weight-bold rounded-[4px] cursor-pointer"
              >
                Start Search
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-xl flex-grow justify-between">
              <div className="flex flex-col gap-md">
                <div className="flex items-center justify-between">
                  <span className="text-label text-muted-text font-tabular">Step 1 of 5</span>
                  <Badge className="bg-accent-fill text-accent-contrast hover:bg-accent-fill shadow-none rounded-[4px] px-sm py-xs text-xs font-weight-bold">
                    Active
                  </Badge>
                </div>
                <h2 className="text-heading font-weight-bold text-primary-text">Tokenization</h2>
                <div className="flex flex-col gap-md">
                  <div className="p-md bg-subtle-surface border border-border-custom rounded-[8px]">
                    <h3 className="text-label text-primary-text font-weight-bold mb-xs">What did the search engine do?</h3>
                    <p className="text-body text-muted-text">
                      It split your query and documents into individual terms.
                    </p>
                  </div>
                  <div className="p-md bg-subtle-surface border border-border-custom rounded-[8px]">
                    <h3 className="text-label text-primary-text font-weight-bold mb-xs">Why does it matter?</h3>
                    <p className="text-body text-muted-text">
                      It allows matching query terms to document terms.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex gap-sm">
                <Button 
                  disabled 
                  className="flex-1 min-h-[44px] bg-subtle-surface text-muted-text font-weight-bold rounded-[4px] cursor-not-allowed border border-border-custom shadow-none"
                >
                  Previous step
                </Button>
                <Button 
                  disabled 
                  className="flex-1 min-h-[44px] bg-subtle-surface text-muted-text font-weight-bold rounded-[4px] cursor-not-allowed border border-border-custom shadow-none"
                >
                  Next step
                </Button>
              </div>
            </div>
          )}
        </section>

        {/* Right Panel: Visualization */}
        <section 
          aria-label="Visualization" 
          className="bg-secondary border border-border-custom rounded-[12px] p-lg border-t-2 border-t-accent-fill flex flex-col gap-xl min-h-[300px]"
        >
          {!started ? (
            <div className="flex flex-col gap-md">
              <h2 className="text-heading font-weight-bold text-primary-text">Your search workspace</h2>
              <p className="text-body text-muted-text">
                Choose a scenario, review the query and documents, then start the search.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-md">
              <h2 className="text-heading font-weight-bold text-primary-text">Tokenization is ready</h2>
              <p className="text-body text-muted-text">
                This lesson view will show what the search engine calculates at this step.
              </p>
            </div>
          )}
        </section>

      </main>
    </div>
  )
}
