import { useState, useMemo } from 'react'
import MapView from './components/MapView'
import CategoryToggles from './components/CategoryToggles'
import PlaceDrawer from './components/PlaceDrawer'
import Ratings from './components/Ratings'
import { WESTERN_POIS, POI_CATEGORIES } from './data/pois'
import { pruneExpired } from './utils/time'
import './styles.css'

export default function App() {
  const [enabled, setEnabled] = useState(
    Object.values(POI_CATEGORIES).reduce((acc, cat) => ({ ...acc, [cat]: true }), {})
  )
  const [selectedPlaceId, setSelectedPlaceId] = useState(null)
  const [presenceByPlace, setPresenceByPlace] = useState({})
  const [ratingsByPlace, setRatingsByPlace] = useState({})

  // Filter places by enabled categories
  const filteredPlaces = useMemo(() => {
    return WESTERN_POIS.filter(place => enabled[place.category])
  }, [enabled])

  const selectedPlace = selectedPlaceId 
    ? WESTERN_POIS.find(p => p.id === selectedPlaceId)
    : null

  // Presence helper kept local so map and list stay in sync with PlaceDrawer check-ins
  const getPresenceCount = (presenceByPlace, placeId) => {
    return pruneExpired(presenceByPlace?.[placeId] || []).length
  }

  const scoreByPlace = useMemo(() => {
    const scores = {}
    WESTERN_POIS.forEach(place => {
      const ratings = ratingsByPlace[place.id] || []
      if (ratings.length > 0) {
        const avg = ratings.reduce((sum, r) => sum + (r.safe + r.welcoming + r.lighting + r.staffPresence) / 4, 0) / ratings.length
        scores[place.id] = { score: avg.toFixed(1) }
      }
    })
    return scores
  }, [ratingsByPlace])

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>🌸 SheSpace</h1>
        <p className="tagline">Safe spaces for everyone</p>
      </header>

      <div className="app-content">
        <aside className="sidebar">
          <div className="sidebar-section">
            <h2>Categories</h2>
            <CategoryToggles 
              enabled={enabled}
              setEnabled={setEnabled}
            />
          </div>

          <div className="sidebar-section">
            <h2>Locations ({filteredPlaces.length})</h2>
            <div className="places-list">
              {filteredPlaces.map(place => {
                const presence = getPresenceCount(presenceByPlace, place.id)
                const score = scoreByPlace[place.id]?.score
                return (
                  <div 
                    key={place.id} 
                    className={`place-item ${selectedPlaceId === place.id ? 'active' : ''}`}
                    onClick={() => setSelectedPlaceId(place.id)}
                  >
                    <div className="place-item-header">
                      <h3>{place.name}</h3>
                      <span className="rating">👥 {presence}</span>
                    </div>
                    <p className="place-category">{place.category}</p>
                    {score && (
                      <div className="safety-badge">
                        <span className="safety-icon">⭐</span>
                        <span>{score}/5</span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </aside>

        <main className="main-content">
          <MapView 
            places={filteredPlaces}
            onSelectPlace={setSelectedPlaceId}
            presenceByPlace={presenceByPlace}
            getPresenceCount={getPresenceCount}
            scoreByPlace={scoreByPlace}
          />
        </main>

        {selectedPlace && (
          <PlaceDrawer 
            place={selectedPlace}
            presenceByPlace={presenceByPlace}
            setPresenceByPlace={setPresenceByPlace}
            ratingsByPlace={ratingsByPlace}
            onClose={() => setSelectedPlaceId(null)}
          >
            <Ratings 
              placeId={selectedPlace.id}
              ratingsByPlace={ratingsByPlace}
              setRatingsByPlace={setRatingsByPlace}
            />
          </PlaceDrawer>
        )}
      </div>

      <footer className="app-footer">
        <p>Made with ❤️ for safer communities</p>
      </footer>
    </div>
  )
}
