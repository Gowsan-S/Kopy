import './style.css'
import { db } from './firebase.js'

import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  query,
  where
} from 'firebase/firestore'


document.querySelector('#app').innerHTML = `
  <header>
    <div class="logo">Kopy</div>

    <nav>
      <a href="#">Home</a>
      <a href="#">How it works</a>
    </nav>

    <button class="login-btn">Login</button>
  </header>


  <main>
    <section class="hero">

      <h1 class="kopy-animation">
        <span class="letter-box">
          <span class="c-letter">C</span>
          <span class="k-letter">K</span>
        </span><span>opy</span>
      </h1>

      <p class="hero-subtitle">
        Kopy less. <span>Share more.</span>
      </p>


      <div class="kopy-box">

        <input
          id="kopyName"
          type="text"
          placeholder="Enter a short name (e.g. hello)"
        />

        <div id="urlPreview" class="url-preview">
          Your Kopy URL will appear here
        </div>

        <textarea
          id="text"
          placeholder="Paste or type something here..."
        ></textarea>


        <div class="box-bottom">

          <span id="count">
            0 characters
          </span>

          <button id="copyBtn">
            Kopy
          </button>

        </div>

      </div>


      <div class="actions">

  <button id="newBtn">
    ＋ New Kopy
  </button>

  <button id="refreshBtn">
    ↻ Refresh
  </button>

  <button id="shareBtn">
    ↗ Share
  </button>

</div>


  <footer>

    <p>
      © 2026 Kopy. Copy less. Share more.
    </p>

  </footer>
`


// Get elements

const text = document.querySelector('#text')

const count = document.querySelector('#count')

const copyBtn = document.querySelector('#copyBtn')

const newBtn = document.querySelector('#newBtn')

const refreshBtn = document.querySelector('#refreshBtn')

const shareBtn = document.querySelector('#shareBtn')

const kopyName = document.querySelector('#kopyName')

const urlPreview = document.querySelector('#urlPreview')


kopyName.addEventListener('input', () => {

  const name = kopyName.value.trim()

  if (name) {

    urlPreview.textContent =
      `${window.location.origin}/kopy/${encodeURIComponent(name)}`

  } else {

    urlPreview.textContent =
      'Your Kopy URL will appear here'

  }

})


// Character counter

text.addEventListener('input', () => {

  count.textContent =
    `${text.value.length} characters`

})


// Copy button

copyBtn.addEventListener('click', async () => {

  if (!text.value.trim()) {
    return
  }

  await navigator.clipboard.writeText(text.value)

  copyBtn.textContent = 'Kopied ✓'

  setTimeout(() => {

    copyBtn.textContent = 'Kopy'

  }, 1500)

})


// New Kopy button

newBtn.addEventListener('click', () => {

  text.value = ''

  kopyName.value = ''

  count.textContent = '0 characters'

  urlPreview.textContent =
    'Your Kopy URL will appear here'

  history.pushState({}, '', '/')

  text.focus()

})
// Refresh Kopy

refreshBtn.addEventListener('click', async () => {

  const name = kopyName.value.trim()

  if (!name) {
    return
  }

  refreshBtn.textContent = 'Refreshing...'
  refreshBtn.disabled = true

  try {

    const q = query(
      collection(db, 'kopys'),
      where('name', '==', name)
    )

    const snapshot = await getDocs(q)

    if (!snapshot.empty) {

      const data = snapshot.docs[0].data()

      text.value = data.text || ''

      count.textContent =
        `${text.value.length} characters`

    } else {

      alert('Unable to refresh. Kopy not found.')

    }

  } catch (error) {

    console.error(error)

    alert('Unable to refresh. Please try again.')

  } finally {

    refreshBtn.textContent = '↻ Refresh'
    refreshBtn.disabled = false

  }

})

// Share button

shareBtn.addEventListener('click', async () => {

  const name = kopyName.value.trim()

  const content = text.value.trim()


  if (!name) {

    alert('Please enter a short name.')

    kopyName.focus()

    return

  }


  if (!content) {

    alert('Please enter some text.')

    text.focus()

    return

  }


  shareBtn.textContent = 'Saving...'

  shareBtn.disabled = true


  try {

    // Check if name already exists

    const q = query(
      collection(db, 'kopys'),
      where('name', '==', name)
    )

    const existing = await getDocs(q)


    if (!existing.empty) {

      alert(
        'This name is already taken. Please choose another name.'
      )

      shareBtn.textContent = '↗ Share'

      shareBtn.disabled = false

      return

    }


    // Save Kopy

    await addDoc(collection(db, 'kopys'), {

      name: name,

      text: content,

      createdAt: new Date().toISOString()

    })


    // Create simple URL

    const shareUrl =
      `${window.location.origin}/kopy/${encodeURIComponent(name)}`


    // Change browser URL

    history.pushState(
      {},
      '',
      `/kopy/${encodeURIComponent(name)}`
    )


    // Copy URL

    await navigator.clipboard.writeText(shareUrl)


    shareBtn.textContent =
      'Link Kopied ✓'


    setTimeout(() => {

      shareBtn.textContent = '↗ Share'

      shareBtn.disabled = false

    }, 2000)


  } catch (error) {

    console.error(error)

    alert('Could not create Kopy.')

    shareBtn.textContent = '↗ Share'

    shareBtn.disabled = false

  }

})


// Load Kopy from URL

async function loadKopy() {

  const path = window.location.pathname


  if (!path.startsWith('/kopy/')) {

    return

  }


  const name =
    decodeURIComponent(
      path.replace('/kopy/', '')
    )


  if (!name) {

    return

  }


  try {

    const q = query(
      collection(db, 'kopys'),
      where('name', '==', name)
    )


    const snapshot =
      await getDocs(q)


    if (!snapshot.empty) {

      const data =
        snapshot.docs[0].data()


      kopyName.value =
        data.name


      text.value =
        data.text


      count.textContent =
        `${text.value.length} characters`

    } else {

      alert('Kopy not found.')

    }


  } catch (error) {

    console.error(error)

    alert('Could not load Kopy.')

  }

}


// Load existing Kopy

loadKopy()