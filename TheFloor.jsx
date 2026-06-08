import React, { useState, useEffect } from 'react';

export default function TheFloor() {
  const [categories, setCategories] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [jsonUrl, setJsonUrl] = useState('');
  const [loading, setLoading] = useState(false);

  // Załaduj JSON z URL
  const loadJSON = async (url) => {
    setLoading(true);
    try {
      const response = await fetch(url);
      const json = await response.json();
      setCategories(json.categories || []);
      setCurrentIndex(0);
      setShowAnswer(false);
      alert(`✅ Załadowano ${json.categories?.length || 0} pytań!`);
    } catch (error) {
      alert(`❌ Błąd przy ładowaniu: ${error.message}`);
    }
    setLoading(false);
  };

  // Załaduj z pliku lokalnego
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const json = JSON.parse(event.target.result);
          setCategories(json.categories || []);
          setCurrentIndex(0);
          setShowAnswer(false);
          alert(`✅ Załadowano ${json.categories?.length || 0} pytań!`);
        } catch (error) {
          alert('❌ Błąd: Nieprawidłowy JSON');
        }
      };
      reader.readAsText(file);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < categories.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
    } else {
      alert('🎉 Koniec pytań! Wracam na początek...');
      setCurrentIndex(0);
      setShowAnswer(false);
    }
  };

  const prevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowAnswer(false);
    }
  };

  const current = categories[currentIndex] || null;
  const progress = categories.length > 0 ? Math.round(((currentIndex + 1) / categories.length) * 100) : 0;

  return (
    <div style={{ 
      padding: '2rem', 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      maxWidth: '900px', 
      margin: '0 auto',
      minHeight: '100vh',
      background: '#fafafa'
    }}>
      
      {/* HEADER */}
      <div style={{ marginBottom: '2rem', textAlign: 'center', paddingBottom: '2rem', borderBottom: '1px solid #e0e0e0' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 600, margin: '0 0 8px 0', color: '#000' }}>
          ⚡ The Floor
        </h1>
        <p style={{ margin: 0, fontSize: '15px', color: '#666' }}>
          Aplikacja treningowa do teleturnieju
        </p>
      </div>

      {/* LOAD JSON */}
      {categories.length === 0 ? (
        <div style={{ 
          background: '#fff', 
          border: '1px solid #e0e0e0', 
          borderRadius: '12px', 
          padding: '3rem 2rem', 
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: 500, margin: '0 0 1.5rem 0', color: '#000' }}>
            Załaduj pytania
          </h2>
          
          <div style={{ marginBottom: '2rem' }}>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '1rem' }}>
              Opcja 1: Wklej URL do JSON
            </p>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem' }}>
              <input
                type="text"
                placeholder="https://..."
                value={jsonUrl}
                onChange={(e) => setJsonUrl(e.target.value)}
                style={{
                  flex: 1,
                  padding: '10px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '13px'
                }}
              />
              <button
                onClick={() => loadJSON(jsonUrl)}
                disabled={!jsonUrl || loading}
                style={{
                  padding: '10px 24px',
                  background: jsonUrl && !loading ? '#007bff' : '#ccc',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: jsonUrl && !loading ? 'pointer' : 'not-allowed',
                  fontWeight: 500,
                  fontSize: '13px'
                }}
              >
                {loading ? 'Ładuję...' : 'Załaduj'}
              </button>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #e0e0e0', paddingTop: '2rem' }}>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '1rem' }}>
              Opcja 2: Wybierz plik JSON z dysku
            </p>
            <label style={{ 
              display: 'inline-block',
              padding: '12px 24px',
              background: '#f0f0f0',
              border: '1px solid #ddd',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 500,
              fontSize: '13px',
              color: '#333',
              transition: 'all 0.2s'
            }}>
              <input 
                type="file" 
                accept=".json"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
              📁 Wybierz plik
            </label>
          </div>
        </div>
      ) : current ? (
        <div>
          {/* PROGRESS */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px', color: '#666' }}>
              <span>Pytanie {currentIndex + 1} z {categories.length}</span>
              <span>{progress}%</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: '#e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ 
                width: `${progress}%`, 
                height: '100%', 
                background: '#007bff', 
                transition: 'width 0.3s ease'
              }}></div>
            </div>
          </div>

          {/* PYTANIE */}
          <div style={{ 
            background: '#fff', 
            border: '1px solid #e0e0e0', 
            borderRadius: '12px', 
            padding: '2.5rem',
            marginBottom: '2rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}>
            
            {/* KATEGORIA */}
            <div style={{ marginBottom: '1.5rem' }}>
              <span style={{ 
                fontSize: '11px', 
                background: '#f0f0f0', 
                color: '#666', 
                padding: '6px 12px', 
                borderRadius: '20px', 
                display: 'inline-block',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {current.field}
              </span>
              <h2 style={{ fontSize: '28px', fontWeight: 600, margin: '12px 0 0 0', color: '#000' }}>
                {current.category}
              </h2>
            </div>

            {/* ZDJĘCIE */}
            {current.question_type === 'image' ? (
              <div style={{ 
                background: '#f5f5f5', 
                borderRadius: '8px', 
                padding: '2rem',
                marginBottom: '2rem', 
                textAlign: 'center',
                minHeight: '280px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #e0e0e0'
              }}>
                {current.images && current.images[0] ? (
                  <div>
                    <img 
                      src={`/images/${current.images[0]}`}
                      alt={current.category}
                      style={{ maxWidth: '100%', maxHeight: '260px', borderRadius: '6px' }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        if (e.target.nextSibling) e.target.nextSibling.style.display = 'block';
                      }}
                    />
                    <p style={{ 
                      display: 'none', 
                      color: '#999', 
                      fontSize: '12px',
                      margin: '1rem 0 0 0'
                    }}>
                      📷 {current.images[0]}
                    </p>
                  </div>
                ) : (
                  <p style={{ color: '#999' }}>Brak zdjęcia</p>
                )}
              </div>
            ) : null}

            {/* PROMPT */}
            <div style={{ 
              fontSize: '20px',
              fontWeight: 500,
              color: '#007bff',
              marginBottom: '2rem',
              padding: '1.5rem',
              background: '#f0f7ff',
              borderRadius: '8px',
              textAlign: 'center',
              border: '1px solid #d1e7ff'
            }}>
              {current.prompt}
            </div>

            {/* ODPOWIEDŹ */}
            {showAnswer ? (
              <div style={{ 
                background: '#d4edda', 
                border: '1px solid #c3e6cb',
                borderRadius: '8px', 
                padding: '1.5rem',
                color: '#155724'
              }}>
                <p style={{ margin: '0 0 8px 0', fontSize: '11px', fontWeight: 600, opacity: 0.8, textTransform: 'uppercase' }}>
                  ✓ Odpowiedź
                </p>
                <p style={{ margin: 0, fontSize: '24px', fontWeight: 600 }}>
                  {current.answer}
                </p>
                {current.answer_variations && current.answer_variations.length > 1 && (
                  <p style={{ margin: '10px 0 0 0', fontSize: '12px', opacity: 0.8 }}>
                    Warianty: {current.answer_variations.join(', ')}
                  </p>
                )}
              </div>
            ) : (
              <button 
                onClick={() => setShowAnswer(true)}
                style={{ 
                  width: '100%',
                  padding: '14px',
                  background: '#fff',
                  border: '1px solid #007bff',
                  color: '#007bff',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '15px',
                  fontWeight: 600,
                  transition: 'all 0.2s',
                  ':hover': { background: '#f0f7ff' }
                }}
                onMouseOver={(e) => e.target.style.background = '#f0f7ff'}
                onMouseOut={(e) => e.target.style.background = '#fff'}
              >
                Pokaż odpowiedź
              </button>
            )}
          </div>

          {/* KONTROLKI */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '2rem' }}>
            <button
              onClick={prevQuestion}
              disabled={currentIndex === 0}
              style={{ 
                padding: '12px 20px',
                background: currentIndex === 0 ? '#f0f0f0' : '#fff',
                border: '1px solid #ddd',
                borderRadius: '8px',
                cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
                opacity: currentIndex === 0 ? 0.5 : 1,
                fontWeight: 500,
                fontSize: '14px'
              }}
            >
              ← Poprzednie
            </button>
            <button
              onClick={nextQuestion}
              style={{ 
                padding: '12px 20px',
                background: '#007bff',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '14px'
              }}
            >
              Następne →
            </button>
          </div>

          {/* ZAŁADUJ NOWY */}
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={() => { setCategories([]); setCurrentIndex(0); setShowAnswer(false); }}
              style={{
                padding: '10px 20px',
                background: '#f0f0f0',
                border: '1px solid #ddd',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '13px',
                color: '#666',
                fontWeight: 500
              }}
            >
              ↻ Załaduj inne pytania
            </button>
          </div>
        </div>
      ) : null}

      {/* FOOTER */}
      <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #e0e0e0', textAlign: 'center', fontSize: '12px', color: '#999' }}>
        <p>The Floor v1.0 | Aplikacja treningowa</p>
      </div>
    </div>
  );
}