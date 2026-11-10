"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, BadgeCheck, BookOpen, Check, ChevronDown, CircleAlert, ExternalLink, HeartHandshake, Languages, LockKeyhole, MessageCircleWarning, Pause, PhoneCall, Play, ShieldCheck, Smartphone, WalletCards } from "lucide-react";

type Language = "en" | "ta";
type Lesson = {
  id: string;
  icon: typeof WalletCards;
  title: Record<Language, string>;
  intro: Record<Language, string>;
  lookFor: Record<Language, string[]>;
  steps: Record<Language, string[]>;
};

const lessons: Lesson[] = [
  {
    id: "upi",
    icon: WalletCards,
    title: { en: "Pay safely with UPI", ta: "UPI மூலம் பாதுகாப்பாகப் பணம் செலுத்துங்கள்" },
    intro: { en: "A UPI PIN authorises money leaving your account. You never need to enter it to receive money.", ta: "UPI PIN உங்கள் கணக்கிலிருந்து பணம் அனுப்ப அனுமதிக்கிறது. பணம் பெற PIN தேவையில்லை." },
    lookFor: { en: ["A collect request you were not expecting", "A QR code described as a way to receive a refund or prize", "Someone asking for your UPI PIN, OTP or screen share"], ta: ["நீங்கள் எதிர்பார்க்காத பணம் கோரும் UPI கோரிக்கை", "பரிசு அல்லது பணத்திரும்பப் பெற QR குறியீட்டை ஸ்கேன் செய்யச் சொல்வது", "UPI PIN, OTP அல்லது திரைப் பகிர்வைக் கேட்பது"] },
    steps: { en: ["Pause and read the payee name and amount before approving.", "Decline requests you do not recognise. Never share your PIN or OTP.", "For help, use your bank’s official app or the number printed on your card."], ta: ["ஒப்புதல் அளிக்கும் முன் பெறுநர் பெயர் மற்றும் தொகையைச் சரிபார்க்கவும்.", "அறியாத கோரிக்கையை நிராகரிக்கவும். PIN அல்லது OTP-ஐ பகிர வேண்டாம்.", "உதவிக்கு வங்கியின் அதிகாரப்பூர்வ செயலி அல்லது அட்டையில் உள்ள எண்ணைப் பயன்படுத்தவும்."] },
  },
  {
    id: "calls",
    icon: MessageCircleWarning,
    title: { en: "Spot scam calls and messages", ta: "மோசடி அழைப்புகள் மற்றும் செய்திகளை அடையாளம் காணுங்கள்" },
    intro: { en: "Scammers often create fear or urgency so you act before checking. A familiar logo or your name does not prove a message is genuine.", ta: "சரிபார்க்கும் முன் செயல்பட வைக்க மோசடியாளர்கள் பயம் அல்லது அவசரத்தை உருவாக்கலாம். உங்கள் பெயர் அல்லது லோகோ மட்டும் செய்தி உண்மையானது என்பதற்குச் சான்றல்ல." },
    lookFor: { en: ["Threats to arrest you, disconnect your phone or freeze your account right now", "A demand to keep a call secret or move money to a ‘safe account’", "Unexpected prizes, refunds or urgent account links"], ta: ["உடனே கைது, தொலைபேசி துண்டிப்பு அல்லது கணக்கு முடக்கம் என மிரட்டுவது", "அழைப்பை ரகசியமாக வைக்க அல்லது ‘பாதுகாப்புக் கணக்கிற்கு’ பணம் அனுப்பச் சொல்வது", "எதிர்பாராத பரிசு, பணத்திரும்பப் பெறுதல் அல்லது அவசர இணைப்பு"] },
    steps: { en: ["End the call. Do not press links or call back the number in the message.", "Contact the organisation using its official app, website or a number you already trust.", "Talk to someone you trust before sending money or sharing information."], ta: ["அழைப்பைத் துண்டிக்கவும். செய்தியில் உள்ள இணைப்பை அழுத்தவோ அதே எண்ணிற்கு மீண்டும் அழைக்கவோ வேண்டாம்.", "அதிகாரப்பூர்வ செயலி, இணையதளம் அல்லது உங்களுக்குத் தெரிந்த எண்ணில் தொடர்பு கொள்ளவும்.", "பணம் அனுப்பும் முன் அல்லது தகவல் பகிரும் முன் நம்பகமான ஒருவரிடம் பேசுங்கள்."] },
  },
  {
    id: "links",
    icon: Smartphone,
    title: { en: "Check links, jobs and delivery texts", ta: "இணைப்புகள், வேலை மற்றும் பார்சல் செய்திகளைச் சரிபாருங்கள்" },
    intro: { en: "A fake page can look like a bank, courier or job site. Stop when a message asks you to install an app, pay a fee or enter private details through a link.", ta: "போலி இணையப்பக்கம் வங்கி, கூரியர் அல்லது வேலைவாய்ப்பு தளம் போலத் தோன்றலாம். இணைப்பில் செயலி நிறுவ, கட்டணம் செலுத்த அல்லது தனிப்பட்ட விவரங்களை உள்ளிடச் சொன்னால் நிறுத்துங்கள்." },
    lookFor: { en: ["High pay for easy work, followed by a registration or training fee", "A parcel link asking for a small extra payment or card details", "An app file sent over chat or a request to install remote-control software"], ta: ["எளிய வேலைக்கு அதிக சம்பளம் எனக் கூறி, பின்னர் பதிவு அல்லது பயிற்சிக் கட்டணம் கேட்பது", "சிறிய கூடுதல் கட்டணம் அல்லது அட்டை விவரங்களைக் கேட்கும் பார்சல் இணைப்பு", "அரட்டை வழியாக செயலிக் கோப்பு அல்லது தொலைநிலைக் கட்டுப்பாட்டு செயலியை நிறுவச் சொல்வது"] },
    steps: { en: ["Open the official app or type the organisation’s known web address yourself.", "Do not pay to unlock a promised job, prize or parcel without independently verifying it.", "Never install an app at a stranger’s request or give it screen-control access."], ta: ["அதிகாரப்பூர்வ செயலியைத் திறக்கவும் அல்லது தெரிந்த இணைய முகவரியை நீங்களே தட்டச்சு செய்யவும்.", "உறுதி செய்யாமல் வேலை, பரிசு அல்லது பார்சலைப் பெற பணம் செலுத்த வேண்டாம்.", "அறியாதவர் சொல்வதற்காக செயலி நிறுவவோ திரைக் கட்டுப்பாட்டு அனுமதி தரவோ வேண்டாம்."] },
  },
  {
    id: "protect",
    icon: LockKeyhole,
    title: { en: "Protect your phone and accounts", ta: "உங்கள் தொலைபேசி மற்றும் கணக்குகளைப் பாதுகாக்கவும்" },
    intro: { en: "A few small habits make it harder for someone to take over your accounts or misuse your information.", ta: "சில எளிய பழக்கங்கள் உங்கள் கணக்குகளைப் பிறர் கைப்பற்றுவதையும் தகவலைத் தவறாகப் பயன்படுத்துவதையும் கடினமாக்கும்." },
    lookFor: { en: ["The same password used for many accounts", "A login approval or OTP you did not request", "An app asking for access that does not fit what it does"], ta: ["பல கணக்குகளுக்கு ஒரே கடவுச்சொல்லைப் பயன்படுத்துவது", "நீங்கள் கோராத உள்நுழைவு ஒப்புதல் அல்லது OTP", "செயலிக்குத் தேவையில்லாத அனுமதிகளைக் கேட்பது"] },
    steps: { en: ["Use a different, hard-to-guess password for important accounts; enable two-step verification where available.", "Keep your phone and apps updated, use a screen lock, and review app permissions.", "Do not approve a login prompt you did not start. Change the password from the official app or site."], ta: ["முக்கிய கணக்குகளுக்கு வெவ்வேறு, கணிக்க முடியாத கடவுச்சொற்களைப் பயன்படுத்தி, கிடைக்கும் இடங்களில் இருநிலைச் சரிபார்ப்பை இயக்கவும்.", "தொலைபேசி மற்றும் செயலிகளைப் புதுப்பித்து, திரைப் பூட்டை அமைத்து, செயலி அனுமதிகளைச் சரிபார்க்கவும்.", "நீங்கள் தொடங்காத உள்நுழைவு கோரிக்கையை ஏற்க வேண்டாம். அதிகாரப்பூர்வ செயலி அல்லது தளத்தில் கடவுச்சொல்லை மாற்றவும்."] },
  },
];

const copy = {
  en: {
    back: "Back to Namma Ooru", eyebrow: "DIGITAL CONFIDENCE · FOR EVERYONE", title: "Learn at your pace.", subtitle: "Short, clear lessons to help you use digital services with confidence and recognise common online scams.",
    english: "English", tamil: "தமிழ்", path: "YOUR LEARNING PATH", progress: "lessons completed", start: "Read this lesson", finish: "Mark as learned", done: "Learned", warningTitle: "If money has been taken", warning: "Call your bank using its official number straight away. Report financial cyber fraud to helpline 1930 and at the National Cyber Crime Reporting Portal. Keep messages and transaction details as evidence.", call: "Call 1930", report: "Report online", sources: "Trusted guides", small: "No sign-up · Learn in any order · Your progress stays on this device", after: "A good rule: stop, verify using an official channel, then act.",
  },
  ta: {
    back: "நம்ம ஊருக்குத் திரும்பு", eyebrow: "டிஜிட்டல் பாதுகாப்பு · அனைவருக்கும்", title: "உங்கள் வேகத்தில் கற்றுக்கொள்ளுங்கள்.", subtitle: "டிஜிட்டல் சேவைகளை நம்பிக்கையுடன் பயன்படுத்தவும், பொதுவான இணைய மோசடிகளை அறியவும் உதவும் எளிய பாடங்கள்.",
    english: "English", tamil: "தமிழ்", path: "உங்கள் கற்றல் பயணம்", progress: "பாடங்கள் முடிந்தன", start: "இந்தப் பாடத்தைப் படிக்கவும்", finish: "கற்றுவிட்டேன்", done: "கற்றது", warningTitle: "பணம் இழந்திருந்தால்", warning: "உடனே உங்கள் வங்கியின் அதிகாரப்பூர்வ எண்ணில் அழைக்கவும். நிதி இணைய மோசடியை 1930 உதவி எண்ணிலும் தேசிய இணைய குற்றப் புகார் தளத்திலும் தெரிவிக்கவும். செய்திகள் மற்றும் பரிவர்த்தனை விவரங்களை ஆதாரமாக வைத்துக்கொள்ளவும்.", call: "1930 அழைக்கவும்", report: "இணையத்தில் புகார்", sources: "நம்பகமான வழிகாட்டிகள்", small: "பதிவு தேவையில்லை · எந்த வரிசையிலும் கற்கலாம் · முன்னேற்றம் இந்த சாதனத்தில் சேமிக்கப்படும்", after: "நல்ல பழக்கம்: நிறுத்துங்கள், அதிகாரப்பூர்வ வழியில் சரிபாருங்கள், பிறகு செயல்படுங்கள்.",
  },
};

const STORAGE_KEY = "namma-ooru:digital-safety-lessons";
// Replace or reorder these YouTube video entries to update the featured awareness playlist.
const awarenessVideos = [
  {
    id: "DnqQUdkjkWk",
    title: {
      en: "Cyber Crime: How One Click Can Expose Your Personal Information",
      ta: "சைபர் குற்றம்: ஒரே கிளிக்கில் உங்கள் தனிப்பட்ட தகவல்கள் திருடப்படுவது எப்படி?"
    },
    topic: {
      en: "Phone Security · Cyber Crime Awareness",
      ta: "மொபைல் பாதுகாப்பு · சைபர் குற்ற விழிப்புணர்வு"
    },
    source: "Theneer Idaivelai"
  },
  {
    id: "2EGHCd0-UNg",
    title: {
      en: "4 Important UPI Safety Shield Tips",
      ta: "UPI பாதுகாப்பிற்கான 4 முக்கியமான வழிமுறைகள்"
    },
    topic: {
      en: "UPI Payments · Fraud Prevention",
      ta: "UPI பணப்பரிவர்த்தனை · மோசடி தடுப்பு"
    },
    source: "UPI Chalega"
  },
  {
    id: "xsbS7JtCZS0",
    title: {
      en: "WhatsApp Scams and Essential Security Features",
      ta: "WhatsApp மோசடிகள் மற்றும் முக்கியமான பாதுகாப்பு அம்சங்கள்"
    },
    topic: {
      en: "WhatsApp Security · Privacy Protection",
      ta: "WhatsApp பாதுகாப்பு · தனியுரிமை பாதுகாப்பு"
    },
    source: "Theneer Idaivelai"
  },
  {
    id: "xsbS7JtCZS0",
    title: {
      en: "WhatsApp Scams and Essential Security Features",
      ta: "WhatsApp மோசடிகள் மற்றும் முக்கியமான பாதுகாப்பு அம்சங்கள்"
    },
    topic: {
      en: "WhatsApp Security · Privacy Protection",
      ta: "WhatsApp பாதுகாப்பு · தனியுரிமை பாதுகாப்பு"
    },
    source: "Theneer Idaivelai"
  },
  {
    id: "EuzVqm3kwMo",
    title: {
      en: "Worldwide Online Scams: Awareness and Safety Tips",
      ta: "உலகம் முழுவதும் நடைபெறும் ஆன்லைன் மோசடிகள்: விழிப்புணர்வு மற்றும் பாதுகாப்பு வழிமுறைகள்"
    },
    topic: {
      en: "Online Scams · Cyber Safety Awareness",
      ta: "ஆன்லைன் மோசடிகள் · இணையப் பாதுகாப்பு விழிப்புணர்வு"
    },
    source: "Aammii Tharcharbu Sandhai"
  }
];

export default function DigitalSafetyLearning() {
  const [language, setLanguage] = useState<Language>("en");
  const [openLesson, setOpenLesson] = useState<string | null>("upi");
  const [completed, setCompleted] = useState<string[]>([]);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [autoChangeVideos, setAutoChangeVideos] = useState(true);
  const [hydrated, setHydrated] = useState(false);
  const reduceMotion = useReducedMotion();
  const t = copy[language];
  const rotationActive = hydrated && autoChangeVideos && !reduceMotion && !videoPlaying;
  const activeVideo = awarenessVideos[activeVideoIndex];
  const otherVideoIndices = awarenessVideos.map((_, index) => (activeVideoIndex + index + 1) % awarenessVideos.length).slice(0, 4);

  useEffect(() => {
    setHydrated(true);
    try {
      const saved: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      if (Array.isArray(saved)) setCompleted(saved.filter((id): id is string => typeof id === "string" && lessons.some((lesson) => lesson.id === id)));
    } catch { /* Progress is optional. */ }
  }, []);

  useEffect(() => {
    if (!hydrated || reduceMotion || !autoChangeVideos || videoPlaying) return;
    const rotation = window.setInterval(() => setActiveVideoIndex((index) => (index + 1) % awarenessVideos.length), 9000);
    return () => window.clearInterval(rotation);
  }, [autoChangeVideos, hydrated, reduceMotion, videoPlaying]);

  function selectVideo(index: number) {
    setActiveVideoIndex(index);
    setVideoPlaying(false);
    setAutoChangeVideos(false);
  }

  function moveVideo(direction: -1 | 1) {
    setActiveVideoIndex((index) => (index + direction + awarenessVideos.length) % awarenessVideos.length);
    setVideoPlaying(false);
    setAutoChangeVideos(false);
  }

  function playVideo() {
    setAutoChangeVideos(false);
    setVideoPlaying(true);
  }

  function markComplete(id: string) {
    const next = completed.includes(id) ? completed : [...completed, id];
    setCompleted(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* Keep progress for this visit. */ }
  }

  return <div className="learn-page">
    <Link href="/" className="learn-back-link"><ArrowLeft size={15} /> {t.back}</Link>
    <motion.section className="learn-hero" initial={false} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : .45 }}>
      <div className="learn-hero-content"><span className="learn-eyebrow"><ShieldCheck size={14} /> {t.eyebrow}</span><h1>{t.title}</h1><p>{t.subtitle}</p><div className="learn-hero-note"><HeartHandshake size={16} /> {t.after}</div></div>
      <div className="learn-hero-art" aria-hidden="true"><div className="learn-orbit learn-orbit-one" /><div className="learn-orbit learn-orbit-two" /><span><ShieldCheck size={55} /></span><i><LockKeyhole size={18} /></i><b><BookOpen size={17} /></b></div>
      <div className="learn-language" role="group" aria-label="Choose language"><Languages size={15} /><button type="button" onClick={() => setLanguage("en")} aria-pressed={language === "en"}>{t.english}</button><button type="button" onClick={() => setLanguage("ta")} aria-pressed={language === "ta"}>{t.tamil}</button></div>
    </motion.section>

    <section className="learn-path" aria-label={t.path}>
      <div className="learn-path-heading"><div><span className="learn-section-label"><BookOpen size={14} /> {t.path}</span><p>{t.small}</p></div><strong>{completed.length}/{lessons.length}<span> {t.progress}</span></strong></div>
      <div className="learn-progress-track"><span style={{ width: `${completed.length / lessons.length * 100}%` }} /></div>
      <div className="learn-lesson-grid">
        {lessons.map((lesson, index) => {
          const Icon = lesson.icon;
          const isOpen = openLesson === lesson.id;
          const isDone = completed.includes(lesson.id);
          return <motion.article className={`learn-lesson ${isOpen ? "is-open" : ""} ${isDone ? "is-done" : ""}`} key={lesson.id} initial={false} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .12 }} transition={{ duration: reduceMotion ? 0 : .3, delay: reduceMotion ? 0 : index * .04 }}>
            <button className="learn-lesson-toggle" type="button" onClick={() => setOpenLesson(isOpen ? null : lesson.id)} aria-expanded={isOpen}>
              <span className="learn-lesson-icon"><Icon size={19} /></span><span className="learn-lesson-title"><small>LESSON {String(index + 1).padStart(2, "0")}</small><strong>{lesson.title[language]}</strong></span>{isDone ? <BadgeCheck className="learn-done-icon" size={19} /> : <ChevronDown className="learn-chevron" size={18} />}
            </button>
            {isOpen && <div className="learn-lesson-body"><p className="learn-lesson-intro">{lesson.intro[language]}</p><div className="learn-red-flags"><h3><CircleAlert size={15} /> {language === "en" ? "Pause if you notice" : "இவற்றைக் கவனித்தால் நிறுத்துங்கள்"}</h3><ul>{lesson.lookFor[language].map((line) => <li key={line}>{line}</li>)}</ul></div><div className="learn-safe-steps"><h3><Check size={15} /> {language === "en" ? "Safer steps" : "பாதுகாப்பான வழிகள்"}</h3><ol>{lesson.steps[language].map((line) => <li key={line}>{line}</li>)}</ol></div><button className="learn-complete-button" type="button" onClick={() => markComplete(lesson.id)} disabled={isDone}>{isDone ? <><BadgeCheck size={16} /> {t.done}</> : <><Check size={16} /> {t.finish}</>}</button></div>}
          </motion.article>;
        })}
      </div>
    </section>

    <section className="learn-video-section" aria-labelledby="learn-video-title">
      <div className="learn-video-heading"><div><span className="learn-section-label"><BookOpen size={14} /> {language === "en" ? "WATCH AND LEARN" : "பார்த்து கற்றுக்கொள்ளுங்கள்"}</span><h2 id="learn-video-title">{language === "en" ? "Learn through real examples" : "உண்மையான உதாரணங்கள் மூலம் கற்றுக்கொள்ளுங்கள்"}</h2><p>{language === "en" ? "Choose a short, practical session on UPI, scam calls, fake apps and more." : "UPI, மோசடி அழைப்புகள், போலி செயலிகள் மற்றும் பலவற்றைப் பற்றிய நடைமுறை நிகழ்வைத் தேர்ந்தெடுங்கள்."}</p></div><div className="learn-video-heading-actions"><span className={rotationActive ? "learn-video-rotation is-active" : "learn-video-rotation"}><i />{rotationActive ? (language === "en" ? "Auto changing" : "தானாக மாறும்") : (language === "en" ? "Paused" : "நிறுத்தப்பட்டது")}</span><button type="button" className="learn-video-rotation-toggle" onClick={() => setAutoChangeVideos((value) => !value)} disabled={hydrated && Boolean(reduceMotion)} aria-label={rotationActive ? "Pause featured video rotation" : "Resume featured video rotation"}>{rotationActive ? <Pause size={14} /> : <Play size={14} />}</button><a href={`https://www.youtube.com/watch?v=${activeVideo.id}`} target="_blank" rel="noreferrer" className="learn-video-youtube">{language === "en" ? "Open on YouTube" : "YouTube-ல் திறக்கவும்"} <ExternalLink size={14} /></a></div></div>
      <div className="learn-video-featured" aria-live="polite">
        <div className="learn-video-frame" key={activeVideo.id}>
          {videoPlaying ? <iframe src={`https://www.youtube-nocookie.com/embed/${activeVideo.id}?autoplay=1`} title={`${activeVideo.title[language]} · ${activeVideo.source}`} referrerPolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /> : <><img src={`https://img.youtube.com/vi/${activeVideo.id}/hqdefault.jpg`} alt="" loading="lazy" /><div className="learn-video-shade" /><div className="learn-video-featured-info"><span>{activeVideo.topic[language]}</span><strong>{activeVideo.title[language]}</strong><small>{language === "en" ? `Featured video ${activeVideoIndex + 1} of ${awarenessVideos.length}` : `சிறப்பு காணொளி ${activeVideoIndex + 1} / ${awarenessVideos.length}`}</small></div><button type="button" className="learn-video-play" onClick={playVideo} aria-label={`${language === "en" ? "Play" : "இயக்கு"}: ${activeVideo.title[language]}`}><Play size={25} fill="currentColor" /></button></>}
        </div>
        <div className="learn-video-arrows"><button type="button" onClick={() => moveVideo(-1)} aria-label={language === "en" ? "Previous video" : "முந்தைய காணொளி"}><ArrowLeft size={15} /></button><span>{language === "en" ? "FEATURED AWARENESS VIDEO" : "சிறப்பு விழிப்புணர்வு காணொளி"}</span><button type="button" onClick={() => moveVideo(1)} aria-label={language === "en" ? "Next video" : "அடுத்த காணொளி"}><ArrowRight size={15} /></button></div>
      </div>
      <div className="learn-video-thumbnails" aria-label={language === "en" ? "More awareness videos" : "மேலும் விழிப்புணர்வு காணொளிகள்"}>
        {otherVideoIndices.map((index) => { const video = awarenessVideos[index]; return <button type="button" className="learn-video-thumb" key={video.id} onClick={() => selectVideo(index)}>
          <span className="learn-video-thumb-image"><img src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`} alt="" loading="lazy" /><i><Play size={14} fill="currentColor" /></i></span><span className="learn-video-thumb-copy"><small>{video.topic[language]}</small><strong>{video.title[language]}</strong></span>
        </button>; })}
      </div>
      <div className="learn-video-credit"><ShieldCheck size={14} /><span>{language === "en" ? "Videos from CyberDost I4C and the NCERT financial-safety learning series." : "CyberDost I4C மற்றும் NCERT நிதிப் பாதுகாப்பு கற்றல் தொடரிலிருந்து காணொளிகள்."}</span></div>
    </section>

    <section className="learn-emergency" aria-labelledby="learn-emergency-title">
      <div className="learn-emergency-icon"><PhoneCall size={21} /></div><div className="learn-emergency-copy"><span className="learn-section-label">{language === "en" ? "ACT QUICKLY" : "உடனே செயல்படுங்கள்"}</span><h2 id="learn-emergency-title">{t.warningTitle}</h2><p>{t.warning}</p><div className="learn-evidence-note"><CircleAlert size={14} /> {language === "en" ? "Do not delete chats, SMS messages or payment receipts." : "அரட்டை, SMS அல்லது பணம் செலுத்திய ரசீதுகளை அழிக்க வேண்டாம்."}</div></div><div className="learn-emergency-actions"><a href="tel:1930" className="learn-call-button"><PhoneCall size={15} /> {t.call}</a><a href="https://www.cybercrime.gov.in/" target="_blank" rel="noreferrer" className="learn-report-button">{t.report} <ExternalLink size={14} /></a></div>
    </section>

    <section className="learn-sources"><span>{t.sources}</span><a href="https://rbikehtahai.rbi.org.in/safeguards-for-digital-banking.html" target="_blank" rel="noreferrer">RBI · Digital banking safeguards <ExternalLink size={12} /></a><a href="https://cybercrime.gov.in/" target="_blank" rel="noreferrer">National Cyber Crime Reporting Portal <ExternalLink size={12} /></a><a href="https://cybercrime.gov.in/Webform/Crime_NodalGrivanceList.aspx" target="_blank" rel="noreferrer">Cyber helpline and reporting <ExternalLink size={12} /></a><a href="https://cybercrime.gov.in/pdf/Advisories/ADVISORYTAU-ADV-003DigitalArrest06.03.2025.pdf" target="_blank" rel="noreferrer">I4C · Digital arrest advisory <ExternalLink size={12} /></a></section>
  </div>;
}
