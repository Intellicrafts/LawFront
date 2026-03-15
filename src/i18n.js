import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    en: {
        translation: {
            // ── Navbar ──────────────────────────────────
            nav: {
                aiAssistant: 'AI Assistant',
                findLawyer: 'Find Lawyer',
                documents: 'Documents',
                pricing: 'Pricing',
                login: 'Login',
                signUp: 'Sign Up',
                logout: 'Logout',
                profile: 'My Profile',
                wallet: 'Wallet',
                tour: 'Take Tour',
                switchLanguage: 'हिंदी',
                dashboard: 'Dashboard',
                settings: 'Settings',
            },

            // ── Landing Page — Hero ─────────────────────
            hero: {
                badge: 'Bar Council Verified · AI-Enabled · Trust-First',
                headline1: 'Your Legal Matters,',
                headline2: 'In Trusted Hands.',
                headlineGuest1: 'Your Legal Problem,',
                headlineGuest2: 'In Safe Hands.',
                headlineLawyer1: 'Welcome Back,',
                headlineLawyer2: 'Advocate.',
                subheadline: 'Pick up where you left off, or start something new.',
                subheadlineGuestLanding: 'Get clear on your rights. A verified lawyer takes it from there.',
                subheadlineLawyer: 'Manage appointments, track earnings, and connect with matched clients.',
                chatPlaceholder: "Describe your legal situation... (e.g. 'My landlord is refusing to return my deposit')",
                chatHint: 'Press Enter to chat · Shift+Enter for new line',
                chatPrivate: 'Private — not shared without your consent',
                askTia: 'Ask Tia',
                getAiGuidance: 'Get AI Guidance',
                findLawyer: 'Find a Lawyer',
                myAppointments: 'My Appointments',
                orDivider: 'or',
                walletBalance: 'Wallet Balance',
                tryFree: 'Try AI Assistant · 5 free queries/day',
                guestQueriesLeft: '{{count}} free queries left today',
                guestQuerySingular: '{{count}} free query left today',
                dailyLimitReached: 'Daily limit reached',
                signupUnlimited: 'Sign up for unlimited access',
                disclaimer: 'vides AI-driven legal guidance. Verify all critical steps with a registered lawyer.',
                guestDisclaimer: 'AI provides informational assistance only · 5 free queries/day · No account needed',
                lawyerQuestion: 'Are you a lawyer?',
                joinPlatform: 'Join our platform →',
            },

            // ── AI Component Phrases ─────────────────────
            ai: {
                pipeline: 'Intelligence Pipeline',
                neuralActive: 'Neural Engine Active',
                analyzing: 'Analyzing Legal Query',
                intent: 'Identified Intent: {{intent}}',
                retrieving: 'Retrieving Prior Legal Precedents...',
                consulting: 'Consulting Knowledge Base...',
                initializing: 'Initializing Neural Engine...',
                waiting: {
                    structuring: 'Structuring legal framework...',
                    statutory: 'Reviewing statutory compliances...',
                    precedents: 'Cross-referencing judicial precedents...',
                    synthesizing: 'Synthesizing final counsel...',
                },
                skeleton: {
                    analyzing: 'Analyzing Legal Query...',
                    jurisprudence: 'Reviewing Jurisprudence...',
                    caseLaw: 'Cross-referencing Case Law...',
                    citations: 'Checking Citations...',
                    framework: 'Synthesizing Legal Framework...',
                    response: 'Drafting Comprehensive Response...',
                }
            },

            // ── Landing Page — Trust Strip ──────────────
            trust: {
                barCouncil: 'Bar Council Verified Lawyers',
                encrypted: 'End-to-End Encrypted',
                aiAssisted: 'AI-Assisted, Lawyer-Resolved',
            },

            // ── Landing Page — How It Works ─────────────
            howItWorks: {
                badge: 'How It Works',
                title: 'From Query to Resolution',
                steps: {
                    step1: { title: 'Describe Your Issue', desc: 'Type your legal situation in plain language — Hindi or English. Your query is private.' },
                    step2: { title: 'AI Understands & Structures', desc: 'Our AI identifies your case category, jurisdiction, and urgency. It provides next steps.' },
                    step3: { title: 'Match With Verified Lawyers', desc: 'Platform recommends Bar Council-verified lawyers matched by specialization and ratings.' },
                    step4: { title: 'Consult & Resolve', desc: 'Book a consultation via chat, call, or video. Manage documents securely.' },
                },
            },

            // ── Landing Page — Services ─────────────────
            services: {
                badge: 'Services',
                title: 'Everything You Need, One Platform',
                subtitle: 'AI guidance, expert consultations, and legal documents — all pay-per-use, no subscription.',
                aiCounsel: { title: 'AI Legal Assistant', desc: 'Get instant, practical answers to legal queries. Our AI understands Indian law.', meta: 'From ₹2/query' },
                lawyerNetwork: { title: 'Expert Consultation', desc: 'Talk to verified lawyers via audio or video call. Per-minute billing.', meta: 'Per-minute billing' },
                contractDraft: { title: 'Document Drafting', desc: 'AI-powered templates. Generate contracts and agreements in minutes.', meta: 'From ₹50/document' },
                learnMore: 'Learn more',
            },

            // ── Landing Page — Verification ──────────────
            verification: {
                badge: 'Free Verification Service',
                title: "Verify Any Lawyer's Credentials",
                desc: "Before you hire, verify. Our platform cross-references a lawyer's Bar Council enrollment number.",
                feature1: 'Cross-reference Bar Council of India records',
                feature2: 'Verify enrollment number & active practice status',
                feature3: 'Check experience, specializations, & jurisdiction',
                feature4: 'Instant results — completely free of charge',
                cta: 'Verify a Lawyer Now',
                mock: {
                    title: 'Verification Result',
                    status: 'Verified & Active',
                    name: 'Name',
                    barNo: 'Bar Council No.',
                    state: 'Status',
                    areas: 'Practice Areas',
                    exp: 'Experience',
                    loc: 'Location',
                }
            },

            // ── Landing Page — Stats ─────────────────────
            stats: {
                cases: 'Legal Queries Resolved',
                lawyers: 'Verified Advocates',
                satisfaction: 'User Rating',
                response: 'Average Response Time',
            },

            // ── Landing Page — Why Choose Us ─────────────
            whyChooseUs: {
                title: 'Built on Trust. Powered by AI.',
                subtitle: 'The first institutional-grade legal marketplace for everyone.',
                feature1: { title: 'AI That Understands Indian Law', desc: 'Trained on Indian legal codes, precedents, and practical guidance.' },
                feature2: { title: 'Verify Any Lawyer', desc: 'Cross-reference any lawyer\'s Bar Council credentials before engaging.' },
                feature3: { title: 'Encrypted Case Vault', desc: 'All documents stored with bank-grade encryption. Private and secure.' },
                feature4: { title: 'Per-Minute Consultations', desc: 'Talk to lawyers and pay by the minute. Total transparency.' },
                feature5: { title: 'Court Case Status Tracking', desc: 'Track your court case status directly from the platform.' },
                feature6: { title: 'AI Assists. Lawyers Resolve.', desc: 'AI provides info only. Advice comes from verified advocates.' },
            },

            // ── Landing Page — Testimonials ──────────────
            testimonials: {
                badge: 'Client Stories',
                title: 'Trusted Across India',
                subtitle: 'Real stories from clients and lawyers on MeraBakil.',
                list: {
                    t1: { name: 'Rajesh Kumar', title: 'Small Business Owner', content: 'MeraBakil made it so easy to find a property lawyer in Delhi. The AI summary helped me understand my case before I even spoke to anyone.' },
                    t2: { name: 'Adv. Priya Sharma', title: 'High Court Advocate', content: 'The platform handles all my scheduling and document management. I can focus on my clients instead of admin work.' },
                    t3: { name: 'Anjali Singh', title: 'Tech Professional', content: 'Transparent pricing and verified lawyers. I felt safe knowing the Bar Council credentials were pre-checked.' },
                },
            },

            // ── Landing Page — For Lawyers ───────────────
            forLawyers: {
                badge: 'Founding Lawyer Programme',
                title: 'Grow Your Practice on MeraBakil',
                desc1: 'Join as a Founding Lawyer — zero commission for the first 90 days, priority placement, and a "Founding Advocate" badge.',
                desc2: 'Get matched with verified, AI-qualified leads with no cold outreach.',
                cta: 'Register as a Lawyer',
            },

            // ── Landing Page — Lawyer Feature Grid ───────
            lawyerFeatures: {
                f1: { title: 'AI-Qualified Leads', desc: 'Clients are pre-screened by AI — no irrelevant queries, better conversion.' },
                f2: { title: 'Per-Minute Earnings', desc: 'Earn per minute of consultation. Fair, transparent, automatic.' },
                f3: { title: 'Withdraw Anytime', desc: 'Your earnings go to your wallet. Withdraw to your bank whenever you want.' },
                f4: { title: 'AI Research Tools', desc: 'Use our AI to research cases, find precedents, serve clients faster.' },
            },

            // ── Landing Page — Final CTA ─────────────────
            finalCta: {
                title: 'Ready to Get Legal Help?',
                subtitle: 'Describe your situation to our AI. Get matched with a verified lawyer. Pay only for what you use — no subscription, no lock-in.',
                cta: 'Get Started with AI',
                ctaLawyer: 'Browse Verified Lawyers',
            },

            // ── Guest Limit Modal ────────────────────────
            guestModal: {
                title: "You've used your 5 free queries today",
                desc: 'Create a free account to get unlimited access, save your chat history, and use your wallet credits for premium AI legal advice.',
                createAccount: 'Create Free Account',
                signIn: 'Sign In to Existing Account',
                resetNote: 'Free limit resets daily at midnight · No credit card required',
            },

            // ── Footer ───────────────────────────────────
            footer: {
                tagline: 'Democratising access to quality legal assistance.',
                rights: 'All rights reserved.',
                privacy: 'Privacy Policy',
                terms: 'Terms of Service',
                disclaimer: 'Disclaimer',
                refund: 'Refund Policy',
                headers: {
                    practice: 'Practice Areas',
                    quick: 'Quick Links',
                    legal: 'Legal',
                },
                practiceAreas: [
                    'Criminal Law',
                    'Family Law',
                    'Corporate Law',
                    'Property Law',
                    'Tax Law',
                    'Intellectual Property',
                ],
                security: {
                    ssl: '256-bit SSL',
                    verified: 'Verified Lawyers',
                    ai: 'AI-Powered',
                },
            },

            // ── Chat/Hero Extras ─────────────────────────
            chat: {
                welcome: 'Welcome to MeraBakil',
                tagline: 'Your Intelligent Legal Assistant',
                files: '{{count}} File(s)',
                changeModel: 'Change model',
                agentWarning: 'The **{{agent}}** agent is currently in **tuning & training mode** for advanced legal datasets.\n\nFor the best experience with everyday legal tasks and research, please use our flagship **BAKILAT 1.0** agent which is fully optimized and available for production.',
                error: 'An unexpected error occurred. Please try again.',
            },
        },
    },

    hi: {
        translation: {
            // ── Navbar ──────────────────────────────────
            nav: {
                aiAssistant: 'AI सहायक',
                findLawyer: 'वकील खोजें',
                documents: 'दस्तावेज़',
                pricing: 'मूल्य निर्धारण',
                login: 'लॉगिन',
                signUp: 'साइन अप',
                logout: 'लॉगआउट',
                profile: 'मेरी प्रोफ़ाइल',
                wallet: 'वॉलेट',
                tour: 'टूर लें',
                switchLanguage: 'English',
                dashboard: 'डैशबोर्ड',
                settings: 'सेटिंग्स',
            },

            // ── Landing Page — Hero ─────────────────────
            hero: {
                badge: 'बार काउंसिल सत्यापित · AI-सक्षम · विश्वास-प्रथम',
                headline1: 'आपके कानूनी मामले,',
                headline2: 'विश्वसनीय हाथों में।',
                headlineGuest1: 'आपकी कानूनी समस्या,',
                headlineGuest2: 'सुरक्षित हाथों में।',
                headlineLawyer1: 'वापसी पर स्वागत है,',
                headlineLawyer2: 'अधिवक्ता।',
                subheadline: 'जहाँ छोड़ा था वहाँ से आगे बढ़ें, या कुछ नया शुरू करें।',
                subheadlineGuestLanding: 'अपने अधिकारों के बारे में स्पष्ट जानकारी प्राप्त करें। एक सत्यापित वकील उसे वहां से आगे ले जाएगा।',
                subheadlineLawyer: 'अपॉइंटमेंट प्रबंधित करें, कमाई ट्रैक करें और मिलान किए गए ग्राहकों से जुड़ें।',
                chatPlaceholder: "अपनी कानूनी स्थिति बताएं... (जैसे 'मकान मालिक पैसा वापस करने से मना कर रहा है')",
                chatHint: 'Enter दबाएं · Shift+Enter नई लाइन के लिए',
                chatPrivate: 'निजी — आपकी सहमति के बिना साझा नहीं किया गया',
                askTia: 'टिया से पूछें',
                getAiGuidance: 'AI मार्गदर्शन प्राप्त करें',
                findLawyer: 'वकील खोजें',
                myAppointments: 'मेरी अपॉइंटमेंट',
                orDivider: 'या',
                walletBalance: 'वॉलेट बैलेंस',
                tryFree: 'AI सहायक आज़माएं · 5 मुफ्त प्रश्न/दिन',
                guestQueriesLeft: 'आज {{count}} मुफ्त प्रश्न बचे हैं',
                guestQuerySingular: 'आज {{count}} मुफ्त प्रश्न बचा है',
                dailyLimitReached: 'दैनिक सीमा समाप्त',
                signupUnlimited: 'असीमित पहुँच के लिए साइन अप करें',
                disclaimer: 'मेराबाकिल एआई-संचालित कानूनी मार्गदर्शन प्रदान करता है। सभी महत्वपूर्ण कदमों को एक पंजीकृत वकील के साथ सत्यापित करें।',
                guestDisclaimer: 'AI केवल जानकारी प्रदान करता है · 5 मुफ्त प्रश्न/दिन · खाते की आवश्यकता नहीं',
                lawyerQuestion: 'क्या आप एक वकील हैं?',
                joinPlatform: 'हमारे प्लेटफ़ॉर्म से जुड़ें →',
            },

            // ── AI Component Phrases ─────────────────────
            ai: {
                pipeline: 'इंटेलिजेंस पाइपलाइन',
                neuralActive: 'न्यूरल इंजन सक्रिय',
                analyzing: 'कानूनी प्रश्न का विश्लेषण',
                intent: 'पहचाना गया इरादा: {{intent}}',
                retrieving: 'पूर्व कानूनी मिसालों को प्राप्त किया जा रहा है...',
                consulting: 'नॉलेज बेस से परामर्श किया जा रहा है...',
                initializing: 'न्यूरल इंजन शुरू किया जा रहा है...',
                waiting: {
                    structuring: 'कानूनी ढांचे की संरचना...',
                    statutory: 'वैधानिक अनुपालन की समीक्षा...',
                    precedents: 'न्यायिक मिसालों का मिलान...',
                    synthesizing: 'अंतिम परामर्श का संश्लेषण...',
                },
                skeleton: {
                    analyzing: 'कानूनी प्रश्न का विश्लेषण...',
                    jurisprudence: 'विधिशास्त्र की समीक्षा...',
                    caseLaw: 'केस लॉ का मिलान...',
                    citations: 'उद्धरणों की जांच...',
                    framework: 'कानूनी ढांचे का संश्लेषण...',
                    response: 'व्यापक प्रतिक्रिया का मसौदा...',
                }
            },

            // ── Landing Page — Trust Strip ──────────────
            trust: {
                barCouncil: 'बार काउंसिल सत्यापित वकील',
                encrypted: 'एंड-टू-एंड एन्क्रिप्टेड',
                aiAssisted: 'AI-सहायता, वकील-समाधान',
            },

            // ── Landing Page — How It Works ─────────────
            howItWorks: {
                badge: 'यह कैसे काम करता है',
                title: 'प्रश्न से समाधान तक',
                steps: {
                    step1: { title: 'अपनी समस्या बताएं', desc: 'अपनी कानूनी स्थिति सरल भाषा में लिखें — हिंदी या अंग्रेजी। प्रश्न निजी है।' },
                    step2: { title: 'AI समझता और संरचना करता है', desc: 'हमारा AI आपके मामले की श्रेणी, अधिकार क्षेत्र और तत्परता की पहचान करता है।' },
                    step3: { title: 'सत्यापित वकीलों के साथ मिलान', desc: 'प्लेटफ़ॉर्म विशेषज्ञता और रेटिंग के आधार पर सत्यापित वकीलों की सिफारिश करता है।' },
                    step4: { title: 'परामर्श और समाधान', desc: 'चैट, कॉल या वीडियो के माध्यम से परामर्श बुक करें। दस्तावेज़ सुरक्षित रूप से प्रबंधित करें।' },
                },
            },

            // ── Landing Page — Services ─────────────────
            services: {
                badge: 'सेवाएं',
                title: 'हर कानूनी ज़रूरत, एक प्लेटफ़ॉर्म',
                subtitle: 'AI मार्गदर्शन, विशेषज्ञ परामर्श और कानूनी दस्तावेज़ — सभी उपयोग-के-अनुसार भुगतान, कोई सदस्यता नहीं।',
                aiCounsel: { title: 'AI कानूनी सहायक', desc: 'कानूनी प्रश्नों के तत्काल उत्तर प्राप्त करें। हमारा AI भारतीय कानून को समझता है।', meta: '₹2/प्रश्न से' },
                lawyerNetwork: { title: 'विशेषज्ञ परामर्श', desc: 'ऑडियो या वीडियो कॉल के माध्यम से सत्यापित वकीलों से बात करें। प्रति-मिनट बिलिंग।', meta: 'प्रति-मिनट बिलिंग' },
                contractDraft: { title: 'दस्तावेज़ मसौदा', desc: 'AI-संचालित टेम्प्लेट। मिनटों में अनुबंध और समझौते तैयार करें।', meta: '₹50/दस्तावेज़ से' },
                learnMore: 'और जानें',
            },

            // ── Landing Page — Verification ──────────────
            verification: {
                badge: 'मुफ्त सत्यापन सेवा',
                title: 'किसी भी वकील के क्रेडेंशियल सत्यापित करें',
                desc: 'किराए पर लेने से पहले, सत्यापित करें। हमारा प्लेटफ़ॉर्म वकील के बार काउंसिल नामांकन संख्या की जांच करता है।',
                feature1: 'बार काउंसिल ऑफ इंडिया के रिकॉर्ड की जांच करें',
                feature2: 'नामांकन संख्या और सक्रिय प्रैक्टिस स्थिति सत्यापित करें',
                feature3: 'अनुभव, विशेषज्ञता और अधिकार क्षेत्र की जांच करें',
                feature4: 'तत्काल परिणाम — पूरी तरह से निःशुल्क',
                cta: 'अभी वकील सत्यापित करें',
                mock: {
                    title: 'सत्यापन परिणाम',
                    status: 'सत्यापित और सक्रिय',
                    name: 'नाम',
                    barNo: 'बार काउंसिल नंबर',
                    state: 'स्थिति',
                    areas: 'अभ्यास क्षेत्र',
                    exp: 'अनुभव',
                    loc: 'स्थान',
                }
            },

            // ── Landing Page — Stats ─────────────────────
            stats: {
                cases: 'कानूनी प्रश्न हल',
                lawyers: 'सत्यापित वकील',
                satisfaction: 'उपयोगकर्ता रेटिंग',
                response: 'औसत प्रतिक्रिया समय',
            },

            // ── Landing Page — Why Choose Us ─────────────
            whyChooseUs: {
                title: 'विश्वास पर निर्मित। AI द्वारा संचालित।',
                subtitle: 'सभी के लिए पहला संस्थागत कानूनी बाजार।',
                feature1: { title: 'भारतीय कानून को समझने वाला AI', desc: 'भारतीय कानूनी कोड, मिसालों और व्यावहारिक मार्गदर्शन पर प्रशिक्षित।' },
                feature2: { title: 'किसी भी वकील को सत्यापित करें', desc: 'जुड़ने से पहले किसी भी वकील की बार काउंसिल क्रेडेंशियल की जांच करें।' },
                feature3: { title: 'एन्क्रिप्टेड केस वॉल्ट', desc: 'सभी दस्तावेज़ बैंक-ग्रेड एन्क्रिप्शन के साथ संग्रहीत। निजी और सुरक्षित।' },
                feature4: { title: 'प्रति-मिनट परामर्श', desc: 'वकीलों से बात करें और प्रति मिनट भुगतान करें। पूर्ण पारदर्शिता।' },
                feature5: { title: 'कोर्ट केस स्टेटस ट्रैकिंग', desc: 'प्लेटफ़ॉर्म से सीधे अपने कोर्ट केस की स्थिति को ट्रैक करें।' },
                feature6: { title: 'AI सहायता करता है। वकील हल करते हैं।', desc: 'AI केवल जानकारी प्रदान करता है। सलाह सत्यापित अधिवक्ताओं से आती है।' },
            },

            // ── Landing Page — Testimonials ──────────────
            testimonials: {
                badge: 'ग्राहक कहानियाँ',
                title: 'पूरे भारत में विश्वसनीय',
                subtitle: 'मेराबाकिल पर ग्राहकों और वकीलों की वास्तविक कहानियाँ।',
                list: {
                    t1: { name: 'राजेश कुमार', title: 'छोटे व्यवसाय के मालिक', content: 'मेराबाकिल ने दिल्ली में संपत्ति वकील खोजना बहुत आसान बना दिया। एआई सारांश ने मुझे किसी से बात करने से पहले ही अपना मामला समझने में मदद की।' },
                    t2: { name: 'अधिवक्ता प्रिया शर्मा', title: 'उच्च न्यायालय अधिवक्ता', content: 'प्लेटफ़ॉर्म मेरे सभी शेड्यूलिंग और दस्तावेज़ प्रबंधन को संभालता है। मैं एडमिन काम के बजाय अपने क्लाइंट्स पर ध्यान केंद्रित कर सकती हूँ।' },
                    t3: { name: 'अंजलि सिंह', title: 'टेक प्रोफेशनल', content: 'पारदर्शी मूल्य निर्धारण और सत्यापित वकील। मुझे यह जानकर सुरक्षित महसूस हुआ कि बार काउंसिल क्रेडेंशियल्स की पहले ही जांच कर ली गई थी।' },
                },
            },

            // ── Landing Page — For Lawyers ───────────────
            forLawyers: {
                badge: 'फाउंडिंग लॉयर प्रोग्राम',
                title: 'मेराबाकिल पर अपनी प्रैक्टिस बढ़ाएं',
                desc1: 'फाउंडिंग लॉयर के रूप में जुड़ें — पहले 90 दिनों के लिए शून्य कमीशन, प्राथमिकता प्लेसमेंट और "फाउंडिंग एडवोकेट" बैज।',
                desc2: 'बिना किसी कोल्ड आउटरीच के सत्यापित, AI-योग्य लीड के साथ मिलान प्राप्त करें।',
                cta: 'वकील के रूप में पंजीकरण करें',
            },

            // ── Landing Page — Lawyer Feature Grid ───────
            lawyerFeatures: {
                f1: { title: 'AI-योग्य लीड्स', desc: 'क्लाइंट की एआई द्वारा जांच की जाती है — कोई अप्रासंगिक प्रश्न नहीं, बेहतर रूपांतरण।' },
                f2: { title: 'प्रति मिनट कमाई', desc: 'परामर्श के प्रति मिनट कमाएं। निष्पक्ष, पारदर्शी, स्वचालित।' },
                f3: { title: 'कभी भी निकालें', desc: 'आपकी कमाई आपके वॉलेट में जाती है। जब चाहें अपने बैंक में निकाल लें।' },
                f4: { title: 'AI अनुसंधान उपकरण', desc: 'केसों पर शोध करने, मिसालें खोजने के लिए हमारे एआई का उपयोग करें।' },
            },

            // ── Landing Page — Final CTA ─────────────────
            finalCta: {
                title: 'कानूनी सहायता के लिए तैयार हैं?',
                subtitle: 'एआई को अपनी स्थिति बताएं। सत्यापित वकील से मिलें। केवल उपयोग के लिए भुगतान करें — कोई सदस्यता नहीं।',
                cta: 'AI के साथ शुरू करें',
                ctaLawyer: 'सत्यापित वकीलों को देखें',
            },

            // ── Guest Limit Modal ────────────────────────
            guestModal: {
                title: 'आपने आज के 5 मुफ्त प्रश्न उपयोग कर लिए',
                desc: 'असीमित पहुँच के लिए मुफ्त खाता बनाएं, अपना चैट इतिहास सहेजें और प्रीमियम AI कानूनी सलाह के लिए वॉलेट क्रेडिट का उपयोग करें।',
                createAccount: 'मुफ्त खाता बनाएं',
                signIn: 'मौजूदा खाते में साइन इन करें',
                resetNote: 'मुफ्त सीमा रोज़ाना मध्यरात्रि को रीसेट होती है · क्रेडिट कार्ड की आवश्यकता नहीं',
            },

            // ── Footer ───────────────────────────────────
            footer: {
                tagline: 'गुणवत्तापूर्ण कानूनी सहायता तक पहुँच को लोकतांत्रिक बनाना।',
                rights: 'सर्वाधिकार सुरक्षित।',
                privacy: 'गोपनीयता नीति',
                terms: 'सेवा की शर्तें',
                disclaimer: 'अस्वीकरण',
                refund: 'धनवापसी नीति',
                headers: {
                    practice: 'अभ्यास क्षेत्र',
                    quick: 'त्वरित लिंक',
                    legal: 'कानूनी',
                },
                practiceAreas: [
                    'आपराधिक कानून',
                    'पारिवारिक कानून',
                    'कॉर्पोरेट कानून',
                    'संपत्ति कानून',
                    'कर कानून',
                    'बौद्धिक संपदा',
                ],
                security: {
                    ssl: '256-बिट SSL',
                    verified: 'सत्यापित वकील',
                    ai: 'AI-संचालित',
                },
            },

            // ── Chat/Hero Extras ─────────────────────────
            chat: {
                welcome: 'मेराबाकिल में आपका स्वागत है',
                tagline: 'आपका इंटेलिजेंट कानूनी सहायक',
                files: '{{count}} फाइल(ें)',
                changeModel: 'मॉडल बदलें',
                agentWarning: '**{{agent}}** एजेंट वर्तमान में उन्नत कानूनी डेटासेट के लिए **ट्यूनिंग और प्रशिक्षण मोड** में है।\n\nरोजमर्रा के कानूनी कार्यों और शोध के सर्वोत्तम अनुभव के लिए, कृपया हमारे प्रमुख **BAKILAT 1.0** एजेंट का उपयोग करें जो पूरी तरह से अनुकूलित और उत्पादन के लिए उपलब्ध है।',
                error: 'एक अप्रत्याशित त्रुटि हुई। कृपया पुन: प्रयास करें।',
            },
        },
    },
};

i18n.use(initReactI18next).init({
    resources,
    lng: localStorage.getItem('merabakil_lang') || 'en',
    fallbackLng: 'en',
    interpolation: {
        escapeValue: false, // React already escapes
    },
});

export default i18n;
