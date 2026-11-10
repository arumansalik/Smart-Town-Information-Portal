"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowUpRight, BookOpen, Castle, Clock3, Compass, Landmark, MapPin, Mountain, Sparkles, Trees } from "lucide-react";

const formerMlas = [
  { years: "2006 · 2011 · 2016 · 2021", name: "K. R. Periyakaruppan", party: "DMK" },
  { years: "2001", name: "K. K. Umadhevan", party: "AIADMK" },
  { years: "1996", name: "R. Sivaraman", party: "DMK" },
  { years: "1991", name: "Raja Kannappan", party: "AIADMK" },
  { years: "1989", name: "S. S. Thennarasu", party: "DMK" },
  { years: "1984", name: "S. Madhavan", party: "AIADMK" },
  { years: "1980", name: "V. Valmigi", party: "INC" },
  { years: "1977", name: "S. Shanmugam Koothakudi", party: "CPI" },
  { years: "1967 · 1971", name: "S. Madhavan", party: "DMK" },
  { years: "1952", name: "Muthiah Chettiar", party: "Independent" },
];

const landmarks = [
  { name: "Thiruthalinathar Temple", kind: "In Thiruppathur", text: "A living landmark at the heart of town, cared for through Tamil Nadu’s Hindu Religious and Charitable Endowments Department.", icon: Landmark, query: "Arulmigu Thiruthalinatha Swamy Temple Thiruppathur Sivaganga" },
  { name: "Marudhu Brothers memorial", kind: "Town history", text: "Remember the Sivaganga leaders whose resistance and sacrifice are tied to the ruins of the fort at Tiruppathur.", icon: Castle, query: "Marudhu Pandiyar Memorial Tiruppattur Sivaganga" },
  { name: "Thirukoshtiyur", kind: "About 10 km away", text: "The district describes Sowmya Narayana Perumal Temple as an ancient shrine and one of the 108 Divya Desams.", icon: Landmark, query: "Thirukoshtiyur Sowmya Narayana Perumal Temple" },
  { name: "Kundrakudi", kind: "About 12 km away", text: "A hilltop Shanmuganathar temple, with excavated cave shrines at the foot of the hill.", icon: Mountain, query: "Kundrakudi Shanmuganathar Temple" },
  { name: "Pillayarpatti", kind: "On the Karaikudi route", text: "The district tourism guide highlights its rock-cut Karpaga Vinayagar shrine and distinctive two-armed deity.", icon: Landmark, query: "Karpaga Vinayagar Temple Pillayarpatti" },
  { name: "Piranmalai", kind: "Hill country", text: "A landmark of the wider Tiruppathur taluk, known for its hill, historic shrines and the Piranmalai dargah.", icon: Trees, query: "Piranmalai Sivaganga" },
];

const timeline = [
  { year: "1674–1710 · Ramnad kingdom", text: "The district history places the Sivaganga region within the wider Ramnad territories ruled by Kilavan Sethupathy." },
  { year: "1730 · Sivaganga takes shape", text: "After the struggle for Ramnad, Kattaya Thevan divided the territory and granted two portions to Sasivarna Thevar, who became the first Rajah of Sivaganga." },
  { year: "1750 · Muthu Vaduganatha Thevar", text: "Sasivarna Thevar’s son succeeded him as the second Rajah of Sivaganga. Rani Velu Nachiar became his partner in leadership." },
  { year: "1772 · Resistance and exile", text: "East India Company forces attacked Sivaganga. Muthu Vaduganatha Thevar was killed at Kalaiyarkoil; Rani Velu Nachiar and her daughter fled and were later joined by the Marudhu brothers." },
  { year: "1780 · Velu Nachiar returns", text: "Velu Nachiar returned to govern Sivaganga. Chinna Marudhu became her minister and Vellai Marudhu her commander-in-chief; the brothers were entrusted with administration." },
  { year: "1789 · The resistance grows", text: "The district account records Marudhu’s forces defeating a British attack at Kollangudi and notes their links with Veerapandiya Kattabomman." },
  { year: "1799 · A refuge for Oomadurai", text: "After Kattabomman’s execution, Chinna Marudhu gave shelter to his brother Oomadurai, according to the Sivaganga district history." },
  { year: "1801 · The Jambudweepa proclamation", text: "Chinna Marudhu called on people across the peninsula to resist English rule, addressing people across religious communities." },
  { year: "24 October 1801 · Tiruppathur", text: "Marudhu Pandiyan and Vellai Marudu were executed at the ruins of the fort at Tiruppathur. The district history also credits the brothers with temples, ooranis and tanks." },
  { year: "Thiruppathur today", text: "The town remains a gateway to Sivaganga’s temples, memorials and hill country, with history carried in both landmarks and local memory." },
];

export default function ThiruppathurHeritage() {
  const reduceMotion = useReducedMotion();
  return <section className="heritage-experience" aria-labelledby="heritage-title">
    <div className="heritage-opening">
      <div className="heritage-opening-copy">
        <span className="heritage-eyebrow"><BookOpen size={14} /> THIRUPPATHUR · SIVAGANGA</span>
        <h2 id="heritage-title">A town with<br /><em>a story to tell.</em></h2>
        <p>Walk through the memory, landmarks and living heritage of Thiruppathur and the Sivaganga region.</p>
        <a href="#heritage-stories" className="heritage-explore-link">Explore the story <ArrowDown size={15} /></a>
      </div>
      <motion.div className="heritage-diorama-wrap" initial={reduceMotion ? false : { opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .35 }} transition={{ duration: reduceMotion ? 0 : .55 }}>
        <motion.div className="heritage-diorama" whileHover={reduceMotion ? undefined : { rotateY: -5, rotateX: 3, y: -4 }} transition={{ type: "spring", stiffness: 100, damping: 16 }} aria-label="Layered 3D illustration of a Sivaganga heritage landscape">
          <div className="heritage-sky-orb" />
          <div className="heritage-hills heritage-hills-back" />
          <div className="heritage-hills heritage-hills-front" />
          <div className="heritage-fort-wall"><span /><span /><span /><i /><i /><i /></div>
          <div className="heritage-gopuram"><span className="gopuram-tier tier-one" /><span className="gopuram-tier tier-two" /><span className="gopuram-tier tier-three" /><span className="gopuram-top" /><span className="gopuram-door" /></div>
          <div className="heritage-palm palm-one"><i /><i /><i /><i /><b /></div>
          <div className="heritage-palm palm-two"><i /><i /><i /><i /><b /></div>
          <div className="heritage-ground" />
          <span className="heritage-scene-tag"><MapPin size={12} /> Tiruppathur, Tamil Nadu</span>
        </motion.div>
        <span className="heritage-diorama-caption"><Sparkles size={13} /> A layered illustration inspired by the region’s heritage</span>
      </motion.div>
      <a className="heritage-scroll-cue" href="#heritage-stories" aria-label="Scroll to Thiruppathur history"><ArrowDown size={16} /></a>
    </div>

    <div className="heritage-story-grid" id="heritage-stories">
      <article className="heritage-story-card">
        <span className="heritage-section-label">THE STORY OF THE TOWN</span>
        <h3>Remembered for courage.<br />Rooted in community.</h3>
        <p>Thiruppathur stands within the historic Sivaganga region. Its most widely recorded chapter is the resistance of the Marudhu Pandiyars against the East India Company. Their story is part of a larger history of local rule, resistance and care for the land.</p>
        <p>The Sivaganga district account remembers the brothers not only as fighters, but as administrators who built temples and water works. The fort ruins at Tiruppathur mark the place where their lives ended in 1801.</p>
        <a href="https://sivaganga.nic.in/about-district/history/" target="_blank" rel="noreferrer" className="heritage-source-link">Read the district history <ArrowUpRight size={14} /></a>
        <section className="heritage-mla-panel" aria-labelledby="heritage-mla-heading">
          <div className="heritage-mla-current">
            <img src="https://prsindia.org/files/mlatrack/tamil-nadu/17/mla_images/Seenivasa%20Sethupathy%20R.jpg" alt="R. Seenivasa Sethupathy, Tiruppattur MLA" />
            <div className="heritage-mla-current-copy">
              <span className="heritage-section-label">YOUR REPRESENTATIVE · TIRUPPATTUR 185</span>
              <h4 id="heritage-mla-heading">R. Seenivasa Sethupathy</h4>
              <p>TVK · MLA since 4 May 2026</p>
            </div>
            <a className="heritage-mla-profile-link" href="https://prsindia.org/mlatrack/seenivasa-sethupathy-r" target="_blank" rel="noreferrer" aria-label="View R. Seenivasa Sethupathy's profile">Profile <ArrowUpRight size={13} /></a>
          </div>
          <div className="heritage-former-heading"><span>FORMER MLAs</span><a href="https://en.wikipedia.org/wiki/Tiruppattur,_Sivaganga_Assembly_constituency" target="_blank" rel="noreferrer">Election history <ArrowUpRight size={12} /></a></div>
          <div className="heritage-former-list">
            {formerMlas.map((mla) => <div className="heritage-former-row" key={`${mla.years}-${mla.name}`}><span>{mla.years}</span><strong>{mla.name}</strong><small>{mla.party}</small></div>)}
          </div>
        </section>
      </article>
      <div className="heritage-timeline" aria-label="Thiruppathur history timeline">
        {timeline.map((item, index) => <motion.article className="heritage-timeline-item" key={item.year} initial={reduceMotion ? false : { opacity: 0, x: 10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: .5 }} transition={{ duration: reduceMotion ? 0 : .35, delay: reduceMotion ? 0 : index * .07 }}>
          <span className="heritage-timeline-dot"><Clock3 size={13} /></span><div><strong>{item.year}</strong><p>{item.text}</p></div>
        </motion.article>)}
      </div>
    </div>

    <div className="heritage-places-section">
      <div className="heritage-places-heading"><div><span className="heritage-section-label">PLACES THAT HOLD THE STORY</span><h3>See Thiruppathur and beyond</h3><p>Local landmarks and nearby heritage stops for a thoughtful day out.</p></div><span className="heritage-places-count"><Compass size={16} /> 06 places</span></div>
      <div className="heritage-place-grid">
        {landmarks.map(({ name, kind, text, icon: Icon, query }, index) => <motion.article className={`heritage-place-card heritage-place-${index + 1}`} key={name} initial={reduceMotion ? false : { opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .18 }} whileHover={reduceMotion ? undefined : { rotateX: -2, rotateY: index % 2 ? 2 : -2, y: -4 }} transition={{ duration: reduceMotion ? 0 : .28, delay: reduceMotion ? 0 : (index % 3) * .06 }}>
          <span className="heritage-place-number">0{index + 1}</span><span className="heritage-place-icon"><Icon size={20} /></span><span className="heritage-place-kind">{kind}</span><h4>{name}</h4><p>{text}</p><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`} target="_blank" rel="noreferrer" aria-label={`Find ${name} on a map`}>Find on map <ArrowUpRight size={14} /></a>
        </motion.article>)}
      </div>
    </div>

    <footer className="heritage-sources"><span>Sources:</span><a href="https://sivaganga.nic.in/about-district/history/" target="_blank" rel="noreferrer">Sivaganga District history</a><a href="https://sivaganga.nic.in/about-district/elected-representatives/" target="_blank" rel="noreferrer">District elected representatives</a><a href="https://prsindia.org/mlatrack/seenivasa-sethupathy-r" target="_blank" rel="noreferrer">MLA profile and term</a><a href="https://en.wikipedia.org/wiki/Tiruppattur,_Sivaganga_Assembly_constituency" target="_blank" rel="noreferrer">Constituency election history</a><a href="https://sivaganga.nic.in/tourism/holy-places/" target="_blank" rel="noreferrer">Sivaganga Tourism</a><a href="https://hrce.tn.gov.in/hrcehome/consecrated.php?tid=35788" target="_blank" rel="noreferrer">Tamil Nadu HR&amp;CE</a></footer>
  </section>;
}
