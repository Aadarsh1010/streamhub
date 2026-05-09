/**
 * StreamHub - Frontend JavaScript
 * Enhanced with Language Support, Advanced Search, and Download Options
 */

// API Base URL
const API_BASE = '/api';

// Global state
let currentContent = null;
let currentEpisodes = [];
let currentStreams = [];
let currentQuality = null;
let currentLanguage = 'en';
let player = null;
let searchTimeout = null;
let currentSearchResults = [];

// Translations
const translations = {
    en: {
        trending: 'Trending Now',
        heroTitle: 'Unlimited Movies & Series',
        heroSubtitle: 'Watch thousands of movies, TV shows, and anime in HD quality. Stream anytime, anywhere.',
        startWatching: 'Start Watching',
        moreInfo: 'More Info',
        searchResults: 'Search Results for',
        type: 'Type',
        genre: 'Genre',
        year: 'Year',
        quality: 'Quality',
        sortBy: 'Sort By',
        trendingNow: 'Trending Now',
        popularMovies: 'Popular Movies',
        tvShows: 'TV Shows',
        anime: 'Anime',
        seeAll: 'See All',
        selectServer: 'Select Server',
        selectQuality: 'Select Quality',
        episodes: 'Episodes',
        download: 'Download',
        playNow: 'Play Now',
        myList: 'My List',
        share: 'Share',
        browse: 'Browse',
        home: 'Home',
        movies: 'Movies',
        help: 'Help',
        faq: 'FAQ',
        contact: 'Contact Us',
        request: 'Request Content',
        legal: 'Legal',
        terms: 'Terms of Service',
        privacy: 'Privacy Policy',
        dmca: 'DMCA',
        allRights: 'All rights reserved. All videos are sourced from publicly available APIs.',
        addedToList: 'Added to My List',
        shareMessage: 'Check out this on StreamHub!'
    },
    es: {
        trending: 'Tendencias',
        heroTitle: 'Películas y Series Ilimitadas',
        heroSubtitle: 'Mira miles de películas, programas de TV y anime en calidad HD. Transmite en cualquier momento y lugar.',
        startWatching: 'Comenzar a Ver',
        moreInfo: 'Más Info',
        searchResults: 'Resultados de búsqueda para',
        type: 'Tipo',
        genre: 'Género',
        year: 'Año',
        quality: 'Calidad',
        sortBy: 'Ordenar por',
        trendingNow: 'En Tendencia',
        popularMovies: 'Películas Populares',
        tvShows: 'Programas de TV',
        anime: 'Anime',
        seeAll: 'Ver Todo',
        selectServer: 'Seleccionar Servidor',
        selectQuality: 'Seleccionar Calidad',
        episodes: 'Episodios',
        download: 'Descargar',
        playNow: 'Reproducir',
        myList: 'Mi Lista',
        share: 'Compartir',
        browse: 'Explorar',
        home: 'Inicio',
        movies: 'Películas',
        help: 'Ayuda',
        faq: 'Preguntas Frecuentes',
        contact: 'Contacto',
        request: 'Solicitar Contenido',
        legal: 'Legal',
        terms: 'Términos de Servicio',
        privacy: 'Política de Privacidad',
        dmca: 'DMCA',
        allRights: 'Todos los derechos reservados. Todos los videos provienen de APIs públicamente disponibles.',
        addedToList: 'Agregado a Mi Lista',
        shareMessage: '¡Mira esto en StreamHub!'
    },
    fr: {
        trending: 'Tendances',
        heroTitle: 'Films et Séries Illimités',
        heroSubtitle: 'Regardez des milliers de films, séries TV et anime en qualité HD. Streamez n\'importe quand, n\'importe où.',
        startWatching: 'Commencer',
        moreInfo: 'Plus d\'Info',
        searchResults: 'Résultats de recherche pour',
        type: 'Type',
        genre: 'Genre',
        year: 'Année',
        quality: 'Qualité',
        sortBy: 'Trier par',
        trendingNow: 'Tendances',
        popularMovies: 'Films Populaires',
        tvShows: 'Séries TV',
        anime: 'Anime',
        seeAll: 'Voir Tout',
        selectServer: 'Sélectionner Serveur',
        selectQuality: 'Sélectionner Qualité',
        episodes: 'Épisodes',
        download: 'Télécharger',
        playNow: 'Lecture',
        myList: 'Ma Liste',
        share: 'Partager',
        browse: 'Parcourir',
        home: 'Accueil',
        movies: 'Films',
        help: 'Aide',
        faq: 'FAQ',
        contact: 'Contact',
        request: 'Demander du Contenu',
        legal: 'Mentions Légales',
        terms: 'Conditions d\'Utilisation',
        privacy: 'Politique de Confidentialité',
        dmca: 'DMCA',
        allRights: 'Tous droits réservés. Toutes les vidéos proviennent d\'API publiquement disponibles.',
        addedToList: 'Ajouté à Ma Liste',
        shareMessage: 'Regarde ça sur StreamHub!'
    },
    ar: {
        trending: 'الأكثر رواجاً',
        heroTitle: 'أفلام ومسلسلات لا محدودة',
        heroSubtitle: 'شاهد آلاف الأفلام والمسلسلات والأنمي بجودة عالية. استمتع بالمشاهدة في أي وقت وأي مكان.',
        startWatching: 'ابدأ المشاهدة',
        moreInfo: 'المزيد من المعلومات',
        searchResults: 'نتائج البحث عن',
        type: 'النوع',
        genre: 'التصنيف',
        year: 'السنة',
        quality: 'الجودة',
        sortBy: 'ترتيب حسب',
        trendingNow: 'الأكثر رواجاً',
        popularMovies: 'أفلام شائعة',
        tvShows: 'مسلسلات تلفزيونية',
        anime: 'أنمي',
        seeAll: 'عرض الكل',
        selectServer: 'اختر الخادم',
        selectQuality: 'اختر الجودة',
        episodes: 'الحلقات',
        download: 'تحميل',
        playNow: 'شاهد الآن',
        myList: 'قائمتي',
        share: 'مشاركة',
        browse: 'تصفح',
        home: 'الرئيسية',
        movies: 'أفلام',
        help: 'مساعدة',
        faq: 'الأسئلة الشائعة',
        contact: 'اتصل بنا',
        request: 'طلب محتوى',
        legal: 'قانوني',
        terms: 'شروط الخدمة',
        privacy: 'سياسة الخصوصية',
        dmca: 'DMCA',
        allRights: 'جميع الحقوق محفوظة. جميع الفيديوهات من مصادر API متاحة للجمهور.',
        addedToList: 'تمت الإضافة إلى قائمتي',
        shareMessage: 'شاهد هذا على StreamHub!'
    },
    hi: {
        trending: 'ट्रेंडिंग',
        heroTitle: 'असीमित फिल्में और सीरीज़',
        heroSubtitle: 'हजारों फिल्में, टीवी शो और एनीमे HD गुणवत्ता में देखें। कभी भी, कहीं भी स्ट्रीम करें।',
        startWatching: 'देखना शुरू करें',
        moreInfo: 'और जानकारी',
        searchResults: 'खोज परिणाम',
        type: 'प्रकार',
        genre: 'शैली',
        year: 'वर्ष',
        quality: 'गुणवत्ता',
        sortBy: 'क्रमबद्ध करें',
        trendingNow: 'अभी ट्रेंडिंग',
        popularMovies: 'लोकप्रिय फिल्में',
        tvShows: 'टीवी शो',
        anime: 'एनीमे',
        seeAll: 'सभी देखें',
        selectServer: 'सर्वर चुनें',
        selectQuality: 'गुणवत्ता चुनें',
        episodes: 'एपिसोड',
        download: 'डाउनलोड',
        playNow: 'अभी चलाएं',
        myList: 'मेरी सूची',
        share: 'साझा करें',
        browse: 'ब्राउज़ करें',
        home: 'होम',
        movies: 'फिल्में',
        help: 'सहायता',
        faq: 'सामान्य प्रश्न',
        contact: 'संपर्क करें',
        request: 'सामग्री का अनुरोध',
        legal: 'कानूनी',
        terms: 'सेवा की शर्तें',
        privacy: 'गोपनीयता नीति',
        dmca: 'DMCA',
        allRights: 'सर्वाधिकार सुरक्षित। सभी वीडियो सार्वजनिक रूप से उपलब्ध API से हैं।',
        addedToList: 'मेरी सूची में जोड़ा गया',
        shareMessage: 'StreamHub पर यह देखें!'
    },
    id: {
        trending: 'Sedang Tren',
        heroTitle: 'Film & Series Tanpa Batas',
        heroSubtitle: 'Tonton ribuan film, acara TV, dan anime dalam kualitas HD. Streaming kapan saja, di mana saja.',
        startWatching: 'Mulai Menonton',
        moreInfo: 'Info Lebih',
        searchResults: 'Hasil Pencarian untuk',
        type: 'Tipe',
        genre: 'Genre',
        year: 'Tahun',
        quality: 'Kualitas',
        sortBy: 'Urutkan',
        trendingNow: 'Sedang Tren',
        popularMovies: 'Film Populer',
        tvShows: 'Acara TV',
        anime: 'Anime',
        seeAll: 'Lihat Semua',
        selectServer: 'Pilih Server',
        selectQuality: 'Pilih Kualitas',
        episodes: 'Episode',
        download: 'Unduh',
        playNow: 'Putar Sekarang',
        myList: 'Daftar Saya',
        share: 'Bagikan',
        browse: 'Jelajahi',
        home: 'Beranda',
        movies: 'Film',
        help: 'Bantuan',
        faq: 'FAQ',
        contact: 'Hubungi Kami',
        request: 'Minta Konten',
        legal: 'Hukum',
        terms: 'Ketentuan Layanan',
        privacy: 'Kebijakan Privasi',
        dmca: 'DMCA',
        allRights: 'Hak cipta dilindungi. Semua video dari API yang tersedia untuk publik.',
        addedToList: 'Ditambahkan ke Daftar Saya',
        shareMessage: 'Lihat ini di StreamHub!'
    },
    ur: {
        trending: 'ٹرینڈنگ',
        heroTitle: 'لا محدود فلمیں اور سیریز',
        heroSubtitle: 'ہزاروں فلمیں، ٹی وی شوز اور اینی ایم HD کوالٹی میں دیکھیں۔ کبھی بھی، کہیں بھی سٹریم کریں۔',
        startWatching: 'دیکھنا شروع کریں',
        moreInfo: 'مزید معلومات',
        searchResults: 'تلاش کے نتائج برائے',
        type: 'قسم',
        genre: 'ژانر',
        year: 'سال',
        quality: 'کوالٹی',
        sortBy: 'ترتیب',
        trendingNow: 'ابھی ٹرینڈنگ',
        popularMovies: 'مقبول فلمیں',
        tvShows: 'ٹی وی شوز',
        anime: 'انیمی',
        seeAll: 'سب دیکھیں',
        selectServer: 'سرور منتخب کریں',
        selectQuality: 'کوالٹی منتخب کریں',
        episodes: 'اقساط',
        download: 'ڈاؤن لوڈ',
        playNow: 'ابھی چلائیں',
        myList: 'میری فہرست',
        share: 'شیئر کریں',
        browse: 'براؤز کریں',
        home: 'ہوم',
        movies: 'فلمیں',
        help: 'مدد',
        faq: 'عمومی سوالات',
        contact: 'رابطہ کریں',
        request: 'مواد کی درخواست',
        legal: 'قانونی',
        terms: 'سروس کی شرائط',
        privacy: 'پرائیویسی پالیسی',
        dmca: 'DMCA',
        allRights: 'جملہ حقوق محفوظ ہیں۔ تمام ویڈیوز عوامی طور پر دستیاب API سے ہیں۔',
        addedToList: 'میری فہرست میں شامل کر دیا گیا',
        shareMessage: 'StreamHub پر یہ دیکھیں!'
    },
    ph: {
        trending: 'Nagte-trend',
        heroTitle: 'Walang limitasyong Pelikula at Series',
        heroSubtitle: 'Manood ng libu-libong pelikula, TV show, at anime sa HD quality. Stream kahit kailan, kahit saan.',
        startWatching: 'Simulan ang Panonood',
        moreInfo: 'Karagdagang Impormasyon',
        searchResults: 'Resulta ng Paghahanap para sa',
        type: 'Uri',
        genre: 'Genre',
        year: 'Taon',
        quality: 'Kalidad',
        sortBy: 'Ayusin ayon sa',
        trendingNow: 'Nagte-trend Ngayon',
        popularMovies: 'Mga Sikat na Pelikula',
        tvShows: 'Mga TV Show',
        anime: 'Anime',
        seeAll: 'Tingnan Lahat',
        selectServer: 'Pumili ng Server',
        selectQuality: 'Pumili ng Kalidad',
        episodes: 'Mga Episode',
        download: 'I-download',
        playNow: 'I-play Ngayon',
        myList: 'Aking Listahan',
        share: 'I-share',
        browse: 'Tumingin',
        home: 'Home',
        movies: 'Pelikula',
        help: 'Tulong',
        faq: 'FAQ',
        contact: 'Makipag-ugnayan',
        request: 'Humiling ng Content',
        legal: 'Legal',
        terms: 'Mga Tuntunin ng Serbisyo',
        privacy: 'Patakaran sa Privacy',
        dmca: 'DMCA',
        allRights: 'Lahat ng karapatan ay nakalaan. Lahat ng video ay mula sa pampublikong API.',
        addedToList: 'Idinagdag sa Aking Listahan',
        shareMessage: 'Tingnan ito sa StreamHub!'
    }
};

// Sample data for fallback
const SAMPLE_MOVIES = [
    { name: 'Avatar: The Way of Water', year: 2022, score: 7.6, quality: '4K', duration: '3h 12m', genre: 'Sci-Fi', verticalPoster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&h=450&fit=crop', detailPath: 'detail/avatar-2', subjectType: 'MOVIES' },
    { name: 'The Batman', year: 2022, score: 7.8, quality: 'HD', duration: '2h 56m', genre: 'Action', verticalPoster: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=300&h=450&fit=crop', detailPath: 'detail/batman', subjectType: 'MOVIES' },
    { name: 'Spider-Man: No Way Home', year: 2021, score: 8.2, quality: 'HD', duration: '2h 28m', genre: 'Action', verticalPoster: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=300&h=450&fit=crop', detailPath: 'detail/spiderman', subjectType: 'MOVIES' },
    { name: 'Top Gun: Maverick', year: 2022, score: 8.3, quality: '4K', duration: '2h 10m', genre: 'Action', verticalPoster: 'https://images.unsplash.com/photo-1595769816263-9b910be24d5f?w=300&h=450&fit=crop', detailPath: 'detail/topgun', subjectType: 'MOVIES' },
    { name: 'Everything Everywhere All at Once', year: 2022, score: 7.9, quality: 'HD', duration: '2h 19m', genre: 'Sci-Fi', verticalPoster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=300&h=450&fit=crop', detailPath: 'detail/eeaao', subjectType: 'MOVIES' },
    { name: 'Black Panther: Wakanda Forever', year: 2022, score: 6.9, quality: 'HD', duration: '2h 41m', genre: 'Action', verticalPoster: 'https://images.unsplash.com/photo-1560167016-022b78a0258e?w=300&h=450&fit=crop', detailPath: 'detail/blackpanther', subjectType: 'MOVIES' },
];

const SAMPLE_SERIES = [
    { name: 'Breaking Bad', year: '2008-2013', score: 9.5, quality: 'HD', duration: '45m', genre: 'Drama', episodes: '62 EP', verticalPoster: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=300&h=450&fit=crop', detailPath: 'detail/breakingbad', subjectType: 'TV_SERIES' },
    { name: 'Game of Thrones', year: '2011-2019', score: 9.2, quality: '4K', duration: '60m', genre: 'Fantasy', episodes: '73 EP', verticalPoster: 'https://images.unsplash.com/photo-1595769816263-9b910be24d5f?w=300&h=450&fit=crop', detailPath: 'detail/got', subjectType: 'TV_SERIES' },
    { name: 'Stranger Things', year: 2016, score: 8.7, quality: '4K', duration: '50m', genre: 'Sci-Fi', episodes: '34 EP', verticalPoster: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=300&h=450&fit=crop', detailPath: 'detail/strangerthings', subjectType: 'TV_SERIES' },
    { name: 'The Last of Us', year: 2023, score: 8.8, quality: 'HD', duration: '45m', genre: 'Drama', episodes: '9 EP', verticalPoster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&h=450&fit=crop', detailPath: 'detail/tlou', subjectType: 'TV_SERIES' },
    { name: 'The Witcher', year: 2019, score: 8.0, quality: '4K', duration: '60m', genre: 'Fantasy', episodes: '24 EP', verticalPoster: 'https://images.unsplash.com/photo-1514539079130-25950c84af65?w=300&h=450&fit=crop', detailPath: 'detail/witcher', subjectType: 'TV_SERIES' },
    { name: 'Wednesday', year: 2022, score: 8.1, quality: 'HD', duration: '45m', genre: 'Comedy', episodes: '8 EP', verticalPoster: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=300&h=450&fit=crop', detailPath: 'detail/wednesday', subjectType: 'TV_SERIES' },
];

const SAMPLE_ANIME = [
    { name: 'Attack on Titan', year: 2013, score: 9.0, quality: 'HD', duration: '24m', genre: 'Action', episodes: '98 EP', verticalPoster: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=300&h=450&fit=crop', detailPath: 'detail/aot', subjectType: 'ANIME' },
    { name: 'Demon Slayer', year: 2019, score: 8.7, quality: 'HD', duration: '24m', genre: 'Action', episodes: '55 EP', verticalPoster: 'https://images.unsplash.com/photo-1541562232579-512a21360020?w=300&h=450&fit=crop', detailPath: 'detail/demonslayer', subjectType: 'ANIME' },
    { name: 'Jujutsu Kaisen', year: 2020, score: 8.6, quality: 'HD', duration: '24m', genre: 'Action', episodes: '47 EP', verticalPoster: 'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=300&h=450&fit=crop', detailPath: 'detail/jjk', subjectType: 'ANIME' },
    { name: 'One Piece', year: 1999, score: 8.9, quality: 'HD', duration: '24m', genre: 'Adventure', episodes: '1100+ EP', verticalPoster: 'https://images.unsplash.com/photo-1560972550-aba3456b5564?w=300&h=450&fit=crop', detailPath: 'detail/onepiece', subjectType: 'ANIME' },
    { name: 'Chainsaw Man', year: 2022, score: 8.5, quality: 'HD', duration: '24m', genre: 'Action', episodes: '12 EP', verticalPoster: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=300&h=450&fit=crop', detailPath: 'detail/chainsawman', subjectType: 'ANIME' },
    { name: 'Spy x Family', year: 2022, score: 8.4, quality: 'HD', duration: '24m', genre: 'Comedy', episodes: '37 EP', verticalPoster: 'https://images.unsplash.com/photo-1620336655052-b04c2ad3236c?w=300&h=450&fit=crop', detailPath: 'detail/spyxfamily', subjectType: 'ANIME' },
];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

async function initApp() {
    setupEventListeners();
    initPlayer();
    await loadHomeContent();
    window.addEventListener('scroll', handleScroll);
}

// Initialize Video.js Player
function initPlayer() {
    player = videojs('videoPlayer', {
        controls: true,
        autoplay: false,
        preload: 'auto',
        fluid: true,
        responsive: true,
        playbackRates: [0.5, 1, 1.25, 1.5, 2],
        html5: {
            vhs: {
                overrideNative: true,
                limitRenditionByPlayerDimensions: true,
                useBandwidthFromLocalStorage: true
            }
        }
    });

    player.on('error', function() {
        const error = player.error();
        console.error('Video error:', error);
        showToast('Error playing video: ' + (error?.message || 'Unknown error'), 'error');
    });
}

// Event Listeners
function setupEventListeners() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch(searchInput.value);
    });
    
    document.getElementById('playerModal').addEventListener('click', (e) => {
        if (e.target.id === 'playerModal') closeModal();
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    // Close language dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.language-selector')) {
            document.getElementById('langDropdown').classList.remove('show');
        }
    });
}

// Language Functions
function toggleLanguageDropdown() {
    document.getElementById('langDropdown').classList.toggle('show');
}

function changeLanguage(code, name) {
    currentLanguage = code;
    document.getElementById('currentLang').textContent = name;
    
    // Update active state
    document.querySelectorAll('.lang-option').forEach(el => el.classList.remove('active'));
    event.target.classList.add('active');
    
    // Apply translations
    applyTranslations();
    
    // Close dropdown
    document.getElementById('langDropdown').classList.remove('show');
    
    // Set RTL for Arabic/Urdu
    document.body.dir = (code === 'ar' || code === 'ur') ? 'rtl' : 'ltr';
    
    showToast(`Language changed to ${name}`);
}

function applyTranslations() {
    const t = translations[currentLanguage];
    if (!t) return;
    
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) el.textContent = t[key];
    });
}

function getText(key) {
    return translations[currentLanguage]?.[key] || translations['en'][key];
}

// Scroll Handler
function handleScroll() {
    const header = document.getElementById('header');
    header.classList.toggle('scrolled', window.scrollY > 50);
}

// Load Homepage Content
async function loadHomeContent() {
    try {
        const response = await fetch(`${API_BASE}/home`);
        const data = await response.json();
        
        if (data.code === 0 && data.data) {
            let subjects = [];
            
            if (data.data.subject_list && Array.isArray(data.data.subject_list)) {
                subjects = data.data.subject_list;
            } else if (data.data.operatingList) {
                data.data.operatingList.forEach(op => {
                    if (op.banner && op.banner.items) {
                        subjects = subjects.concat(op.banner.items.map(item => ({
                            ...item,
                            subjectType: item.subjectType || 'MOVIES'
                        })));
                    }
                });
            }
            
            if (subjects.length > 0) {
                renderSections(subjects);
                return;
            }
        }
        
        useSampleData();
    } catch (error) {
        console.error('Error loading home:', error);
        showToast('Using demo mode', 'error');
        useSampleData();
    }
}

function useSampleData() {
    renderGrid('trendingGrid', [...SAMPLE_MOVIES.slice(0, 3), ...SAMPLE_SERIES.slice(0, 3)]);
    renderGrid('moviesGrid', SAMPLE_MOVIES);
    renderGrid('seriesGrid', SAMPLE_SERIES);
    renderGrid('animeGrid', SAMPLE_ANIME);
}

function renderSections(subjects) {
    const movies = [], series = [], anime = [], trending = [];
    
    subjects.forEach(item => {
        if (!item) return;
        if (!item.name && item.title) item.name = item.title;
        if (!item.verticalPoster && item.image) item.verticalPoster = item.image.url || item.image;
        if (!item.detailPath && item.id) item.detailPath = `subject/${item.id}`;
        
        const type = item.subjectType || 'MOVIES';
        if (type === 'MOVIES') movies.push(item);
        else if (type === 'TV_SERIES') series.push(item);
        else if (type === 'ANIME') anime.push(item);
        if (trending.length < 6) trending.push(item);
    });
    
    renderGrid('trendingGrid', trending.length > 0 ? trending : [...SAMPLE_MOVIES.slice(0, 3), ...SAMPLE_SERIES.slice(0, 3)]);
    renderGrid('moviesGrid', movies.length > 0 ? movies.slice(0, 12) : SAMPLE_MOVIES);
    renderGrid('seriesGrid', series.length > 0 ? series.slice(0, 12) : SAMPLE_SERIES);
    renderGrid('animeGrid', anime.length > 0 ? anime.slice(0, 12) : SAMPLE_ANIME);
}

function renderGrid(elementId, items) {
    const grid = document.getElementById(elementId);
    if (!grid) return;
    
    if (!items || items.length === 0) {
        grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-secondary);">${getText('noResults') || 'No content available'}</div>`;
        return;
    }
    
    grid.innerHTML = items.map(item => createCardHTML(item)).join('');
}

function createCardHTML(item) {
    const poster = item.verticalPoster || item.horizontalPoster || item.poster || item.image?.url || 
                  'https://via.placeholder.com/300x450/1f1f1f/666?text=No+Poster';
    const title = item.name || item.title || 'Unknown';
    const year = item.year || item.releaseYear || item.pubDate || item.period || '';
    const rating = item.score || item.rating || (Math.random() * 2 + 7).toFixed(1);
    const quality = item.quality || item.resolution || 'HD';
    const episodes = item.episodes || item.episodeCount || '';
    const detailPath = item.detailPath || item.id || '';
    const subjectType = item.subjectType || 'MOVIES';
    
    return `
        <div class="content-card" onclick="openContent('${detailPath}', '${subjectType}')">
            <div class="card-poster">
                <img src="${poster}" alt="${title}" loading="lazy" 
                     onerror="this.src='https://via.placeholder.com/300x450/1f1f1f/666?text=No+Poster'">
                <div class="card-overlay">
                    <div class="play-btn"><i class="fas fa-play"></i></div>
                </div>
                <div class="card-badges">
                    <span class="quality-badge">${quality}</span>
                    ${episodes ? `<span class="episode-badge">${episodes}</span>` : ''}
                </div>
            </div>
            <div class="card-info">
                <h3 class="card-title" title="${title}">${title}</h3>
                <div class="card-meta">
                    <span class="rating"><i class="fas fa-star"></i> ${rating}</span>
                    <span>${year}</span>
                </div>
            </div>
        </div>
    `;
}

// Search Functions
function handleSearch(e) {
    clearTimeout(searchTimeout);
    const query = e.target.value.trim();
    
    if (query.length === 0) {
        showHome();
        return;
    }
    
    if (query.length < 2) return;
    
    searchTimeout = setTimeout(() => performSearch(query), 500);
}

async function performSearch(query) {
    const searchResults = document.getElementById('searchResults');
    const searchQuery = document.getElementById('searchQuery');
    const searchGrid = document.getElementById('searchGrid');
    const searchSpinner = document.getElementById('searchSpinner');
    const mainContent = document.getElementById('mainContent');
    const hero = document.getElementById('hero');
    
    searchResults.classList.add('active');
    mainContent.style.display = 'none';
    hero.style.display = 'none';
    
    searchQuery.textContent = query;
    searchGrid.innerHTML = '';
    searchSpinner.classList.add('active');
    
    try {
        const response = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}&per_page=50`);
        const data = await response.json();
        
        searchSpinner.classList.remove('active');
        
        if (data.code === 0 && data.data && data.data.subject_list && data.data.subject_list.length > 0) {
            currentSearchResults = data.data.subject_list;
            applyFilters();
        } else {
            // Fallback to sample data
            const allSamples = [...SAMPLE_MOVIES, ...SAMPLE_SERIES, ...SAMPLE_ANIME];
            currentSearchResults = allSamples.filter(item => 
                item.name.toLowerCase().includes(query.toLowerCase())
            );
            applyFilters();
        }
    } catch (error) {
        searchSpinner.classList.remove('active');
        const allSamples = [...SAMPLE_MOVIES, ...SAMPLE_SERIES, ...SAMPLE_ANIME];
        currentSearchResults = allSamples.filter(item => 
            item.name.toLowerCase().includes(query.toLowerCase())
        );
        applyFilters();
    }
}

// Apply Filters
function applyFilters() {
    const searchGrid = document.getElementById('searchGrid');
    const typeFilter = document.getElementById('filterType').value;
    const genreFilter = document.getElementById('filterGenre').value;
    const yearFilter = document.getElementById('filterYear').value;
    const qualityFilter = document.getElementById('filterQuality').value;
    const sortBy = document.getElementById('sortBy').value;
    
    let filtered = [...currentSearchResults];
    
    // Apply filters
    if (typeFilter) filtered = filtered.filter(i => i.subjectType === typeFilter);
    if (genreFilter) filtered = filtered.filter(i => (i.genre || '').includes(genreFilter));
    if (yearFilter) filtered = filtered.filter(i => {
        const year = String(i.year || i.releaseYear || '');
        return yearFilter === 'older' ? parseInt(year) < 2020 : year.includes(yearFilter);
    });
    if (qualityFilter) filtered = filtered.filter(i => (i.quality || i.resolution) === qualityFilter);
    
    // Apply sorting
    if (sortBy === 'newest') filtered.sort((a, b) => (b.year || 0) - (a.year || 0));
    else if (sortBy === 'rating') filtered.sort((a, b) => (b.score || 0) - (a.score || 0));
    
    if (filtered.length > 0) {
        searchGrid.innerHTML = filtered.map(item => createCardHTML(item)).join('');
    } else {
        searchGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-secondary);"><i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem; display: block;"></i>No results found</div>`;
    }
}

// Filter Content by Type
async function filterContent(type) {
    const searchResults = document.getElementById('searchResults');
    const searchQuery = document.getElementById('searchQuery');
    const searchGrid = document.getElementById('searchGrid');
    const mainContent = document.getElementById('mainContent');
    const hero = document.getElementById('hero');
    
    const typeNames = {
        'MOVIES': getText('movies') || 'Movies',
        'TV_SERIES': getText('tvShows') || 'TV Shows',
        'ANIME': getText('anime') || 'Anime',
        '': getText('all') || 'All Content'
    };
    
    searchResults.classList.add('active');
    mainContent.style.display = 'none';
    hero.style.display = 'none';
    
    searchQuery.textContent = typeNames[type] || type;
    searchGrid.innerHTML = '<div class="spinner active"></div>';
    
    // Set filter dropdown
    document.getElementById('filterType').value = type;
    
    let samples = [];
    if (!type || type === 'MOVIES') samples = [...samples, ...SAMPLE_MOVIES];
    if (!type || type === 'TV_SERIES') samples = [...samples, ...SAMPLE_SERIES];
    if (!type || type === 'ANIME') samples = [...samples, ...SAMPLE_ANIME];
    
    currentSearchResults = samples;
    document.querySelector('.spinner.active')?.classList.remove('active');
    applyFilters();
}

function showHome() {
    document.getElementById('searchResults').classList.remove('active');
    document.getElementById('mainContent').style.display = 'block';
    document.getElementById('hero').style.display = 'flex';
    document.getElementById('searchInput').value = '';
    
    document.querySelectorAll('.nav-links a').forEach(link => link.classList.remove('active'));
    document.querySelector('.nav-links a')?.classList.add('active');
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Open Content Modal
async function openContent(detailPath, contentType) {
    if (!detailPath || detailPath === 'undefined') {
        showToast('Content not available', 'error');
        return;
    }
    
    const modal = document.getElementById('playerModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalRating = document.getElementById('modalRating');
    const modalYear = document.getElementById('modalYear');
    const modalQuality = document.getElementById('modalQuality');
    const modalDuration = document.getElementById('modalDuration');
    const modalGenre = document.getElementById('modalGenre');
    const episodeSection = document.getElementById('episodeSection');
    const qualitySelector = document.getElementById('qualitySelector');
    const serverSelector = document.getElementById('serverSelector');
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    modalTitle.textContent = 'Loading...';
    modalDescription.textContent = '';
    episodeSection.style.display = 'none';
    qualitySelector.style.display = 'none';
    serverSelector.style.display = 'none';
    document.getElementById('downloadSection').style.display = 'none';
    
    try {
        const response = await fetch(`${API_BASE}/details/${detailPath}`);
        const data = await response.json();
        
        if (data.code === 0 && data.data) {
            const item = data.data;
            currentContent = item;
            
            modalTitle.textContent = item.name || item.title || 'Unknown';
            modalDescription.textContent = item.description || item.introduction || item.summary || 'No description available.';
            modalRating.textContent = item.score || item.rating || 'N/A';
            modalYear.textContent = item.year || item.releaseYear || item.pubDate || item.period || '';
            modalQuality.textContent = item.quality || item.resolution || 'HD';
            modalDuration.innerHTML = `<i class="fas fa-clock"></i> ${item.duration || '2h 15m'}`;
            modalGenre.innerHTML = `<i class="fas fa-tag"></i> ${item.genre || 'Action'}`;
            
            // Extract streams
            currentStreams = [];
            if (item.resolutionList && item.resolutionList.length > 0) {
                currentStreams = item.resolutionList.map((res, idx) => ({
                    id: idx,
                    quality: res.resolution || res.quality || 'HD',
                    url: res.url || res.resourceURL || res.mp4 || res.m3u8,
                    size: res.size,
                    type: res.type || 'mp4'
                })).filter(s => s.url);
            }
            
            // TV Series episodes
            if ((contentType === 'TV_SERIES' || item.subjectType === 'TV_SERIES') && item.seasonList?.length > 0) {
                episodeSection.style.display = 'block';
                renderEpisodes(item.seasonList);
            } else {
                episodeSection.style.display = 'none';
            }
            
            // Quality selector
            if (currentStreams.length > 0) {
                renderQualitySelector(currentStreams);
                renderServerSelector(currentStreams);
                loadStream(currentStreams[0]);
            } else {
                loadDemoContent(contentType);
            }
            
            renderDownloadLinks();
            
            const poster = item.horizontalPoster || item.verticalPoster || item.poster || item.image?.url;
            if (poster) document.getElementById('heroBg').style.backgroundImage = `url('${poster}')`;
        } else {
            loadDemoContent(contentType);
        }
    } catch (error) {
        console.error('Error:', error);
        loadDemoContent(contentType);
    }
}

function loadDemoContent(contentType) {
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalRating = document.getElementById('modalRating');
    const modalYear = document.getElementById('modalYear');
    const modalGenre = document.getElementById('modalGenre');
    const episodeSection = document.getElementById('episodeSection');
    
    currentStreams = [
        { id: 0, quality: '1080p', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', type: 'mp4' },
        { id: 1, quality: '720p', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', type: 'mp4' },
        { id: 2, quality: '480p', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', type: 'mp4' }
    ];
    
    if (contentType === 'TV_SERIES') {
        modalTitle.textContent = 'Demo TV Series';
        modalDescription.textContent = 'This is a demo TV series. In production, this would show the actual series description and episodes.';
        modalRating.textContent = '8.5';
        modalYear.textContent = '2023';
        modalGenre.innerHTML = '<i class="fas fa-tag"></i> Drama';
        episodeSection.style.display = 'block';
        
        document.getElementById('episodeList').innerHTML = `
            <div class="episode-item active" onclick="playDemoEpisode(1, this)">
                <div class="episode-number">1</div>
                <div class="episode-info"><div class="episode-title">Pilot Episode</div><div class="episode-duration">45 min</div></div>
                <i class="fas fa-play-circle" style="color: var(--primary); font-size: 1.5rem;"></i>
            </div>
            <div class="episode-item" onclick="playDemoEpisode(2, this)">
                <div class="episode-number">2</div>
                <div class="episode-info"><div class="episode-title">Episode 2</div><div class="episode-duration">42 min</div></div>
                <i class="fas fa-play-circle" style="color: var(--primary); font-size: 1.5rem;"></i>
            </div>
            <div class="episode-item" onclick="playDemoEpisode(3, this)">
                <div class="episode-number">3</div>
                <div class="episode-info"><div class="episode-title">Episode 3</div><div class="episode-duration">48 min</div></div>
                <i class="fas fa-play-circle" style="color: var(--primary); font-size: 1.5rem;"></i>
            </div>
        `;
    } else {
        modalTitle.textContent = 'Demo Movie';
        modalDescription.textContent = 'This is a demo movie. In production, this would stream the actual movie content.';
        modalRating.textContent = '7.8';
        modalYear.textContent = '2024';
        modalGenre.innerHTML = '<i class="fas fa-tag"></i> Action';
        episodeSection.style.display = 'none';
    }
    
    renderQualitySelector(currentStreams);
    renderServerSelector(currentStreams);
    renderDownloadLinks();
    loadStream(currentStreams[0]);
}

function renderQualitySelector(streams) {
    const container = document.getElementById('qualitySelector');
    const optionsDiv = document.getElementById('qualityOptions');
    
    if (streams.length <= 1) {
        container.style.display = 'none';
        return;
    }
    
    container.style.display = 'block';
    optionsDiv.innerHTML = streams.map((stream, index) => `
        <span class="quality-option ${index === 0 ? 'active' : ''}" onclick="selectQuality(${index}, this)">${stream.quality}</span>
    `).join('');
}

function selectQuality(index, element) {
    document.querySelectorAll('.quality-option').forEach(el => el.classList.remove('active'));
    element.classList.add('active');
    
    if (currentStreams[index]) {
        loadStream(currentStreams[index]);
        showToast(`Switched to ${currentStreams[index].quality}`);
    }
}

function renderServerSelector(streams) {
    const container = document.getElementById('serverSelector');
    const buttonsDiv = document.getElementById('serverButtons');
    
    container.style.display = 'block';
    buttonsDiv.innerHTML = streams.map((stream, index) => `
        <button class="server-btn ${index === 0 ? 'active' : ''}" onclick="selectServer(${index}, this)">
            Server ${index + 1} ${stream.quality ? `(${stream.quality})` : ''}
        </button>
    `).join('');
}

function selectServer(index, element) {
    document.querySelectorAll('.server-btn').forEach(el => el.classList.remove('active'));
    element.classList.add('active');
    
    if (currentStreams[index]) {
        loadStream(currentStreams[index]);
        showToast(`Switched to Server ${index + 1}`);
    }
}

function loadStream(stream) {
    if (!player || !stream?.url) return;
    
    currentQuality = stream;
    
    const isHLS = stream.url.includes('.m3u8') || stream.type === 'hls';
    const isDASH = stream.url.includes('.mpd') || stream.type === 'dash';
    
    let source = {
        src: stream.url.includes('commondatastorage.googleapis.com') ? stream.url : `/proxy/video?url=${encodeURIComponent(stream.url)}`,
        type: isHLS ? 'application/x-mpegURL' : (isDASH ? 'application/dash+xml' : 'video/mp4')
    };
    
    player.src(source);
    player.play().catch(e => console.log('Autoplay prevented:', e));
}

function renderEpisodes(seasons) {
    const episodeList = document.getElementById('episodeList');
    currentEpisodes = [];
    
    let html = '';
    seasons.forEach((season, sIdx) => {
        if (season.episodeList?.length > 0) {
            html += `<div style="margin-bottom: 1rem;"><h5 style="margin-bottom: 0.5rem; color: var(--text-secondary);">Season ${season.seasonNumber || sIdx + 1}</h5>`;
            
            season.episodeList.forEach((ep, eIdx) => {
                currentEpisodes.push(ep);
                const isActive = currentEpisodes.length === 1 ? 'active' : '';
                html += `
                    <div class="episode-item ${isActive}" onclick="playEpisode(${currentEpisodes.length - 1}, this)">
                        <div class="episode-number">${ep.episodeNumber || eIdx + 1}</div>
                        <div class="episode-info">
                            <div class="episode-title">${ep.name || `Episode ${eIdx + 1}`}</div>
                            <div class="episode-duration">${ep.duration || '24 min'}</div>
                        </div>
                        <i class="fas fa-play-circle" style="color: var(--primary); font-size: 1.5rem;"></i>
                    </div>
                `;
            });
            html += '</div>';
        }
    });
    
    episodeList.innerHTML = html || '<p style="color: var(--text-secondary);">No episodes available</p>';
}

function playEpisode(index, element) {
    const episode = currentEpisodes[index];
    
    document.querySelectorAll('.episode-item').forEach(el => el.classList.remove('active'));
    if (element) element.classList.add('active');
    
    if (episode?.resolutionList?.length > 0) {
        const streams = episode.resolutionList.map(res => ({
            quality: res.resolution || res.quality || 'HD',
            url: res.url || res.resourceURL || res.mp4 || res.m3u8,
            type: res.type || 'mp4'
        })).filter(s => s.url);
        
        if (streams.length > 0) {
            currentStreams = streams;
            renderQualitySelector(streams);
            loadStream(streams[0]);
            showToast('Playing episode ' + (episode.episodeNumber || index + 1));
        }
    } else {
        loadDemoStream();
    }
}

function playDemoEpisode(num, element) {
    document.querySelectorAll('.episode-item').forEach(el => el.classList.remove('active'));
    if (element) element.classList.add('active');
    
    const demoStreams = [
        { quality: '1080p', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', type: 'mp4' },
        { quality: '720p', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', type: 'mp4' }
    ];
    currentStreams = demoStreams;
    renderQualitySelector(demoStreams);
    loadStream(demoStreams[0]);
    showToast('Playing episode ' + num);
}

function loadDemoStream() {
    const demoStream = { quality: 'HD', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', type: 'mp4' };
    loadStream(demoStream);
}

function playContent() {
    if (player) player.play().catch(() => showToast('Click play button in player', 'error'));
}

function renderDownloadLinks() {
    const container = document.getElementById('downloadSection');
    const linksDiv = document.getElementById('downloadLinks');
    
    if (!currentStreams?.length) {
        container.style.display = 'none';
        return;
    }
    
    linksDiv.innerHTML = currentStreams.map((stream, idx) => `
        <a href="${stream.url}" class="download-link" target="_blank" download>
            <i class="fas fa-download"></i> ${stream.quality} ${stream.size ? `(${stream.size})` : ''}
        </a>
    `).join('');
}

function toggleDownloadSection() {
    const section = document.getElementById('downloadSection');
    section.style.display = section.style.display === 'none' ? 'block' : 'none';
}

function addToWatchlist() {
    showToast(getText('addedToList'));
}

function shareContent() {
    if (navigator.share) {
        navigator.share({
            title: currentContent?.name || 'StreamHub',
            text: getText('shareMessage'),
            url: window.location.href
        });
    } else {
        navigator.clipboard.writeText(window.location.href);
        showToast('Link copied to clipboard!');
    }
}

function closeModal() {
    const modal = document.getElementById('playerModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
    
    if (player) {
        player.pause();
        player.src('');
    }
}

function scrollToContent() {
    document.getElementById('trendingSection').scrollIntoView({ behavior: 'smooth' });
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    toast.className = `toast ${type}`;
    toastMessage.textContent = message;
    
    const icon = toast.querySelector('i');
    icon.className = type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';
    
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}
