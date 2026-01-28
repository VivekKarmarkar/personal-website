import { useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import { videobooks, categories } from '../data/videobooks'

function VideobookCard({ item }) {
  return (
    <div className="bg-neutral-900 rounded-lg overflow-hidden border border-neutral-800">
      <div className="aspect-video bg-neutral-800 overflow-hidden">
        <iframe
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${item.youtubeId}`}
          title={item.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
      </div>
    </div>
  )
}

export default function Videobooks() {
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedSubcategories, setSelectedSubcategories] = useState([])

  const toggleCategory = (categoryId) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(c => c !== categoryId)
        : [...prev, categoryId]
    )
  }

  const toggleSubcategory = (subcategoryId) => {
    setSelectedSubcategories(prev =>
      prev.includes(subcategoryId)
        ? prev.filter(s => s !== subcategoryId)
        : [...prev, subcategoryId]
    )
  }

  const filteredVideobooks = videobooks.filter(item => {
    // If nothing selected, show all
    if (selectedCategories.length === 0 && selectedSubcategories.length === 0) {
      return true
    }
    // Check if matches selected category or subcategory
    const matchesCategory = selectedCategories.includes(item.category)
    const matchesSubcategory = selectedSubcategories.includes(item.subcategory)
    return matchesCategory || matchesSubcategory
  })

  const clearFilters = () => {
    setSelectedCategories([])
    setSelectedSubcategories([])
  }

  return (
    <Layout>
      <article className="w-full py-16 px-4">
        <div className="max-w-5xl mx-auto">

          {/* Title */}
          <section className="mb-12">
            <h1 className="text-4xl font-bold mb-2">Videobooks</h1>
            <p className="text-dark-muted text-lg">
              A new medium for externalizing imagination
            </p>
          </section>

          <div className="flex gap-8">
            {/* Sidebar filters */}
            <aside className="w-56 flex-shrink-0">
              <h2 className="font-semibold mb-4 text-sm uppercase tracking-wider text-dark-muted">
                Filter by Category
              </h2>
              <div className="space-y-4">
                {categories.map(category => (
                  <div key={category.id}>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category.id)}
                        onChange={() => toggleCategory(category.id)}
                        className="w-4 h-4 rounded border-neutral-600 bg-neutral-800 text-accent focus:ring-accent"
                      />
                      <span className="text-dark-text group-hover:text-white transition-colors font-medium">
                        {category.label}
                      </span>
                    </label>

                    {/* Subcategories */}
                    {category.subcategories.length > 0 && (
                      <div className="ml-7 mt-2 space-y-2">
                        {category.subcategories.map(sub => (
                          <label
                            key={sub.id}
                            className="flex items-center gap-3 cursor-pointer group"
                          >
                            <input
                              type="checkbox"
                              checked={selectedSubcategories.includes(sub.id)}
                              onChange={() => toggleSubcategory(sub.id)}
                              className="w-3 h-3 rounded border-neutral-600 bg-neutral-800 text-accent focus:ring-accent"
                            />
                            <span className="text-dark-muted text-sm group-hover:text-white transition-colors">
                              {sub.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {(selectedCategories.length > 0 || selectedSubcategories.length > 0) && (
                <button
                  onClick={clearFilters}
                  className="mt-4 text-sm text-dark-muted hover:text-white transition-colors"
                >
                  Clear filters
                </button>
              )}
            </aside>

            {/* Content grid */}
            <main className="flex-1">
              {filteredVideobooks.length === 0 ? (
                <div className="text-center py-16 text-dark-muted">
                  <p>No videobooks available yet. Check back soon!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredVideobooks.map(item => (
                    <VideobookCard key={item.id} item={item} />
                  ))}
                </div>
              )}
            </main>
          </div>

        </div>
      </article>
    </Layout>
  )
}
