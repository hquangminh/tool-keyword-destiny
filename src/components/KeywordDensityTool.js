import React, { useState } from 'react'
import { Bar } from 'react-chartjs-2'
import 'chart.js/auto'

const KeywordDensityTool = () => {
  const [text, setText] = useState('')
  const [keywords, setKeywords] = useState([])
  const [results, setResults] = useState([])

  const handleTextChange = (e) => {
    setText(e.target.value)
  }

  const handleKeywordsChange = (e) => {
    setKeywords(e.target.value.split(',').map((kw) => kw.trim()))
  }

  const calculateDensity = () => {
    // Xử lý văn bản thành một đoạn văn liền mạch
    const processedText = text.replace(/\s+/g, ' ').trim()

    const totalWords = processedText.split(/\s+/).filter(Boolean).length
    const keywordResults = keywords.map((keyword) => {
      const keywordCount = processedText.split(new RegExp(`\\b${keyword}\\b`, 'gi')).length - 1
      const keywordDensity = (keywordCount / totalWords) * 100
      let status = 'low'
      let suggestion = ''

      if (keywordDensity >= 0.5 && keywordDensity <= 2.5) {
        status = 'good'
        suggestion = `Mật độ từ khóa '${keyword}' đạt mức tốt.`
      } else if (keywordDensity > 2.5) {
        status = 'high'
        const optimalCount = Math.floor((2.5 / 100) * totalWords)
        const wordsToReduce = keywordCount - optimalCount
        suggestion = `Mật độ từ khóa '${keyword}' quá cao. Hãy giảm bớt từ khóa này khoảng ${wordsToReduce} lần để đưa mật độ về mức tốt (2.5%).`
      } else {
        const optimalCount = Math.ceil((0.5 / 100) * totalWords)
        const wordsToAdd = optimalCount - keywordCount
        suggestion = `Mật độ từ khóa '${keyword}' quá thấp. Hãy thêm từ khóa này khoảng ${wordsToAdd} lần vào văn bản để đạt mức tốt (0.5%).`
      }

      return { keyword, density: keywordDensity.toFixed(2), status, suggestion }
    })
    setResults(keywordResults)
  }

  const data = {
    labels: results.map((result) => result.keyword),
    datasets: [
      {
        label: 'Density',
        data: results.map((result) => result.density),
        backgroundColor: results.map((result) => (result.status === 'low' ? 'yellow' : result.status === 'good' ? 'green' : 'red')),
      },
    ],
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Keyword Density Tool</h1>
      <textarea
        placeholder='Paste your text here...'
        rows='10'
        cols='80'
        value={text}
        onChange={handleTextChange}
        style={{ width: '100%', marginBottom: '10px' }}
      />
      <input
        type='text'
        placeholder='Enter keywords (comma-separated)...'
        value={keywords.join(', ')}
        onChange={handleKeywordsChange}
        style={{ width: '100%', marginBottom: '10px' }}
      />
      <button onClick={calculateDensity} style={{ marginBottom: '20px' }}>
        Calculate Density
      </button>
      <h2>Keyword Density Results</h2>
      <Bar data={data} />
      <h3>Suggestions</h3>
      <div>
        {results.map((result, index) => (
          <p key={index}>{result.suggestion}</p>
        ))}
      </div>
    </div>
  )
}

export default KeywordDensityTool
