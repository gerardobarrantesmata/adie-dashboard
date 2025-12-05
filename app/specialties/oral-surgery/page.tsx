"use client";

import Link from "next/link";

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-xs text-slate-100 outline-none ring-sky-500/60 focus:border-sky-400 focus:ring-1 ${
        props.className ?? ""
      }`}
    />
  );
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-xs text-slate-100 outline-none ring-sky-500/60 focus:border-sky-400 focus:ring-1 ${
        props.className ?? ""
      }`}
    >
      {props.children}
    </select>
  );
}

function TextArea({
  rows = 3,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      rows={rows}
      className={`w-full resize-none rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-xs text-slate-100 outline-none ring-sky-500/60 focus:border-sky-400 focus:ring-1 ${
        props.className ?? ""
      }`}
    />
  );
}

function Card(props: {
  title: string;
  subtitle?: string;
  badge?: string;
  children: React.ReactNode;
}) {
  const { title, subtitle, badge, children } = props;
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-4 md:px-5 md:py-5 shadow-[0_20px_70px_rgba(15,23,42,0.9)]">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-1 text-[11px] text-slate-500">{subtitle}</p>
          )}
        </div>
        {badge && (
          <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.18em] text-emerald-300">
            {badge}
          </span>
        )}
      </div>
      {children}
    </section>
  );
}

export default function OralSurgeryRecordPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-6xl px-4 pb-24 pt-8">
        {/* Header */}
        <header className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-emerald-400">
              Specialties · Layer 3
            </p>
            <h1 className="mt-1 text-2xl md:text-3xl font-semibold tracking-tight text-slate-50">
              Oral & Maxillofacial Surgery · Operative Record
            </h1>
            <p className="mt-2 max-w-2xl text-xs md:text-sm text-slate-400">
              Hospital-level documentation for OMFS: anesthesia, team, surgical
              details, bone management, sutures, biomaterials and postoperative
              plan — all in one structured view.
            </p>
          </div>

          <Link
            href="/specialties"
            className="rounded-full border border-slate-700 bg-slate-900/70 px-4 py-1.5 text-xs md:text-sm text-slate-200 hover:border-sky-500 hover:text-sky-100 transition-colors"
          >
            ← Back to Specialties Universe
          </Link>
        </header>

        {/* Context & team */}
        <Card
          title="Surgical Context & Team"
          subtitle="Where, why and by whom the procedure is performed."
          badge="Pre-op"
        >
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-300">
                Patient (link EMR)
              </label>
              <button className="w-full rounded-full border border-sky-500/70 bg-sky-500/10 px-3 py-2 text-[11px] font-semibold text-sky-100 hover:bg-sky-500/20 transition">
                Select patient from EMR
              </button>
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-300">
                Surgical case ID
              </label>
              <Input placeholder="ADIE-OMFS-0001" />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-300">
                Setting
              </label>
              <Select defaultValue="">
                <option value="">Select setting…</option>
                <option>Clinic / office-based</option>
                <option>Ambulatory surgery center</option>
                <option>Hospital OR – day surgery</option>
                <option>Hospital OR – inpatient</option>
                <option>Emergency room / trauma bay</option>
              </Select>
            </div>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-4">
            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-300">
                Urgency
              </label>
              <Select defaultValue="">
                <option value="">Select…</option>
                <option>Elective</option>
                <option>Urgent</option>
                <option>Emergency</option>
              </Select>
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-300">
                ASA physical status
              </label>
              <Select defaultValue="">
                <option value="">Select ASA…</option>
                <option>ASA I</option>
                <option>ASA II</option>
                <option>ASA III</option>
                <option>ASA IV</option>
                <option>ASA V</option>
              </Select>
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-300">
                Primary surgeon
              </label>
              <Input placeholder="OMFS surgeon name…" />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-300">
                Assistant(s)
              </label>
              <Input placeholder="Assistants, residents, fellows…" />
            </div>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-300">
                Anesthesia provider
              </label>
              <Select defaultValue="">
                <option value="">Select provider…</option>
                <option>Anesthesiologist (MD/DO)</option>
                <option>CRNA</option>
                <option>OMFS – office sedation</option>
                <option>Anesthesia resident / trainee</option>
                <option>Dental anesthesiologist</option>
              </Select>
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-300">
                Scrub nurse / tech
              </label>
              <Input placeholder="Scrub team…" />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-300">
                Circulating nurse
              </label>
              <Input placeholder="Circulator…" />
            </div>
          </div>
        </Card>

        {/* Main grid */}
        <div className="mt-6 grid gap-5 lg:grid-cols-[1.6fr,1.4fr]">
          {/* Left column: anesthesia + procedure + instruments */}
          <div className="space-y-5">
            <Card
              title="Anesthesia & Monitoring"
              subtitle="Type of anesthesia, airway management, NPO, monitoring and timing."
              badge="Anesthesia"
            >
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Anesthesia type
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Local anesthesia only</option>
                    <option>Local + nitrous oxide</option>
                    <option>IV sedation</option>
                    <option>Deep sedation</option>
                    <option>General anesthesia – nasotracheal</option>
                    <option>General anesthesia – orotracheal</option>
                    <option>General anesthesia – LMA</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Sedation depth
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Minimal sedation</option>
                    <option>Moderate sedation</option>
                    <option>Deep sedation</option>
                    <option>General anesthesia</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Airway management
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Spontaneous ventilation – natural airway</option>
                    <option>Nasal endotracheal tube</option>
                    <option>Oral endotracheal tube</option>
                    <option>Laryngeal mask airway (LMA)</option>
                    <option>Tracheostomy</option>
                  </Select>
                </div>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-4">
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    NPO status
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Compliant with guidelines</option>
                    <option>Not compliant</option>
                    <option>Emergency – NPO waived</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Anesthesia start time
                  </label>
                  <Input placeholder="HH:MM" />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Anesthesia end time
                  </label>
                  <Input placeholder="HH:MM" />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Monitoring
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Standard (ECG, NIBP, SpO₂, capnography)</option>
                    <option>Standard + arterial line</option>
                    <option>Standard + invasive monitoring</option>
                  </Select>
                </div>
              </div>

              <div className="mt-3">
                <label className="mb-1 block text-[11px] font-medium text-slate-300">
                  Anesthesia notes
                </label>
                <TextArea placeholder="Pre-op evaluation, airway assessment, events during induction / emergence, any complications…" />
              </div>
            </Card>

            <Card
              title="Surgical Procedure"
              subtitle="What was done, where, and on which side."
              badge="Operative"
            >
              <div className="grid gap-4 md:grid-cols-4">
                <div className="md:col-span-2">
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Main procedure category
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Simple / surgical exodontia</option>
                    <option>Impacted third molars</option>
                    <option>Pre-prosthetic surgery</option>
                    <option>Benign pathology (cyst / tumor)</option>
                    <option>Trauma — fractures</option>
                    <option>Orthognathic surgery</option>
                    <option>TMJ surgery</option>
                    <option>Implant surgery</option>
                    <option>Sinus lift / augmentation</option>
                    <option>Reconstructive bone grafting</option>
                    <option>Soft tissue surgery</option>
                    <option>Other / combined procedure</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Region
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Maxilla</option>
                    <option>Mandible</option>
                    <option>Maxilla & mandible</option>
                    <option>Midface / orbit</option>
                    <option>TMJ</option>
                    <option>Other craniofacial</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Side
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Right</option>
                    <option>Left</option>
                    <option>Bilateral</option>
                    <option>Midline</option>
                  </Select>
                </div>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Tooth / site identifiers
                  </label>
                  <Input placeholder="e.g. 18, 28, parasymphysis, condyle…" />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Surgical start time
                  </label>
                  <Input placeholder="HH:MM" />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Surgical end time
                  </label>
                  <Input placeholder="HH:MM" />
                </div>
              </div>

              <div className="mt-3">
                <label className="mb-1 block text-[11px] font-medium text-slate-300">
                  Key operative steps (summary)
                </label>
                <TextArea placeholder="Incision type, flap design, exposure, osteotomy, fixation, closure, any intraoperative findings…" />
              </div>
            </Card>

            <Card
              title="Instruments, Burs & Bone Management"
              subtitle="How bone and hard tissues were managed, including power instruments and piezo."
              badge="Bone"
            >
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Main bone instrumentation
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>
                      Rotary burs (high-speed / surgical handpiece)
                    </option>
                    <option>Piezosurgery</option>
                    <option>Oscillating saw</option>
                    <option>Rongeurs / osteotomes / chisels</option>
                    <option>Combination of techniques</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Representative burs / tips
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>#557 / #701 carbide fissure burs</option>
                    <option>Round burs (#2–#6)</option>
                    <option>Long-shank fissure burs</option>
                    <option>Piezosurgery bone tips</option>
                    <option>Saw blades</option>
                    <option>Other / mixed</option>
                  </Select>
                </div>
              </div>

              <div className="mt-3">
                <label className="mb-1 block text-[11px] font-medium text-slate-300">
                  Bone management notes
                </label>
                <TextArea placeholder="Cortical removal, bone window, sinus floor elevation, ridge splitting, contouring, preservation techniques…" />
              </div>
            </Card>
          </div>

          {/* Right column: grafts + sutures + meds + post-op */}
          <div className="space-y-5">
            <Card
              title="Bone Grafting & Biomaterials"
              subtitle="Type of graft, brand, membranes and adjunctive biomaterials."
              badge="Graft"
            >
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Bone graft used?
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>No graft used</option>
                    <option>Autogenous bone</option>
                    <option>Allograft</option>
                    <option>Xenograft</option>
                    <option>Alloplast</option>
                    <option>Combination of materials</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Graft brand / description
                  </label>
                  <Input placeholder="e.g. particulate cortical-cancellous, block graft, brand names…" />
                </div>
              </div>

              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Membrane
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>None</option>
                    <option>Resorbable collagen membrane</option>
                    <option>Non-resorbable PTFE</option>
                    <option>Titanium-reinforced membrane</option>
                    <option>Titanium mesh</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Other biomaterials
                  </label>
                  <Input placeholder="PRF / PRP, growth factors, hemostatic agents…" />
                </div>
              </div>

              <div className="mt-3">
                <label className="mb-1 block text-[11px] font-medium text-slate-300">
                  Graft / biomaterial notes
                </label>
                <TextArea placeholder="Sites grafted, volume approximations, membrane fixation, stability, soft tissue management…" />
              </div>
            </Card>

            <Card
              title="Sutures & Closure"
              subtitle="Material, size, needle type and closure pattern — just like a hospital operative note."
              badge="Closure"
            >
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Suture material
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Silk</option>
                    <option>Chromic gut</option>
                    <option>Plain gut</option>
                    <option>Vicryl / PGA</option>
                    <option>Monocryl</option>
                    <option>PTFE</option>
                    <option>Nylon / polypropylene</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Suture size
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>3-0</option>
                    <option>4-0</option>
                    <option>5-0</option>
                    <option>6-0</option>
                    <option>Other</option>
                  </Select>
                </div>
              </div>

              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Needle type
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Reverse cutting</option>
                    <option>Conventional cutting</option>
                    <option>Taper point</option>
                    <option>Spatulated</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Suture pattern
                  </label>
                  <Select defaultValue="">
                    <option value="">Select pattern…</option>
                    <option>Simple interrupted</option>
                    <option>Continuous</option>
                    <option>Horizontal mattress</option>
                    <option>Vertical mattress</option>
                    <option>Sling</option>
                    <option>Figure-of-eight</option>
                    <option>Combination</option>
                  </Select>
                </div>
              </div>

              <div className="mt-3">
                <label className="mb-1 block text-[11px] font-medium text-slate-300">
                  Closure notes
                </label>
                <TextArea placeholder="Primary closure vs. secondary intention, tension-free flap advancement, releases, any dehiscence risk…" />
              </div>
            </Card>

            <Card
              title="Medications & Intraoperative Summary"
              subtitle="Local anesthetic, antibiotics, steroids, analgesics and global summary."
              badge="Peri-op"
            >
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Local anesthetic solution
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>
                      Lidocaine 2% with epinephrine 1:100,000
                    </option>
                    <option>
                      Articaine 4% with epinephrine 1:100,000
                    </option>
                    <option>
                      Mepivacaine 3% (no vasoconstrictor)
                    </option>
                    <option>
                      Bupivacaine 0.5% with epinephrine 1:200,000
                    </option>
                    <option>Other / combination</option>
                  </Select>
                  <label className="mt-2 mb-1 block text-[11px] font-medium text-slate-300">
                    Total volume (mL)
                  </label>
                  <Input placeholder="e.g. 7 mL" />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Antibiotic prophylaxis
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>None</option>
                    <option>Amoxicillin</option>
                    <option>Amoxicillin + clavulanate</option>
                    <option>Clindamycin</option>
                    <option>Cefazolin</option>
                    <option>Other regimen</option>
                  </Select>
                  <label className="mt-2 mb-1 block text-[11px] font-medium text-slate-300">
                    Steroid / anti-inflammatory
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>None</option>
                    <option>Dexamethasone</option>
                    <option>Methylprednisolone</option>
                    <option>Other steroid</option>
                  </Select>
                </div>
              </div>

              <div className="mt-3 grid gap-3 md:grid-cols-3">
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Estimated blood loss
                  </label>
                  <Input placeholder="mL" />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    IV fluids
                  </label>
                  <Input placeholder="Type & mL" />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Intra-op complications
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>None</option>
                    <option>Minor, no sequelae</option>
                    <option>Major, discussed with patient</option>
                  </Select>
                </div>
              </div>

              <div className="mt-3">
                <label className="mb-1 block text-[11px] font-medium text-slate-300">
                  Intraoperative summary
                </label>
                <TextArea placeholder="Global summary of the case, stability of fixation, sinus integrity, nerve visualization / protection, airway events, etc." />
              </div>
            </Card>

            <Card
              title="Postoperative Plan & Disposition"
              subtitle="Where the patient goes, pain plan, diet and follow-up."
              badge="Post-op"
            >
              <div className="grid gap-3 md:grid-cols-3">
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Disposition
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Home same day</option>
                    <option>PACU then discharge</option>
                    <option>Admitted – floor</option>
                    <option>Admitted – stepdown / ICU</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Pain control plan
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Non-opioid only</option>
                    <option>Opioid + non-opioid</option>
                    <option>Regional block + oral meds</option>
                    <option>Other / custom</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Diet
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Clear liquids</option>
                    <option>Full liquids</option>
                    <option>Soft diet</option>
                    <option>Non-chew diet</option>
                    <option>As tolerated</option>
                  </Select>
                </div>
              </div>

              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Post-op instructions (key points)
                  </label>
                  <TextArea placeholder="Ice / swelling control, bleeding management, hygiene, sinus precautions, activity restrictions…" />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Follow-up plan
                  </label>
                  <TextArea placeholder="First postoperative visit, suture removal date, imaging control, when to call urgently…" />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
