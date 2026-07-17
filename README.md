# Reach The Launch

منصة عقارية مخصصة بالكامل لـ **الـ Launches** فقط — مش زي Nawy اللي بتعرض كل المشاريع القديمة والجديدة مع بعض. هنا كل مشروع معروض هو Launch حالي، ومعاه بالظبط "أحسن وقت للشراء" (Best Time to Buy) واضح في صفحته.

React (Vite) + Tailwind + Firebase (Auth + Firestore) — مجاني بالكامل، ومترفوع على Vercel.

---

## 1) الأدوار (Roles)

| الدور | الصلاحيات |
|---|---|
| **Guest** (زائر) | يتصفح كل الـ Launches والـ Developers، وييجي يدوس "Contact Us" بيتطلب منه تسجيل الدخول |
| **User** (عميل مسجل) | كل حاجة الـ Guest + يقدر يبعت "Contact Us" (عام أو لمشروع معين) ببياناته |
| **Admin** (سب-أدمن) | يضيف/يعدل/يحذف أي Launch + يشوف كل رسايل الـ Contact Us |
| **Super Admin** (الأدمن الأساسي/الأول) | كل حاجة الـ Admin + يقدر يخلي أي User يبقى Admin (أو يرجعه User تاني) |

الـ Super Admin مش بيتعمل من الموقع نفسه لأسباب أمان — بيتحدد يدويًا من Firebase Console (خطوات تحت).

---

## 2) خطوات ربط Firebase (مجاني بالكامل - Spark Plan)

1. اعمل مشروع جديد على [Firebase Console](https://console.firebase.google.com)
2. من Build > Authentication > Sign-in method: فعّل **Email/Password** و **Google**
   - لما تفعّل Google هيطلب "Project support email" — اختار إيميلك واحفظ
   - **مهم قبل الرفع على Vercel**: من Authentication > Settings > Authorized domains، ضيف دومين الموقع بتاعك على Vercel (مثلاً `reach-the-launch.vercel.app`) — من غيرها زرار "Continue with Google" هيدي Error
   - **تسجيل الدخول بالإيميل والباسورد شغال 100% من أي متصفح أو موبايل من غير أي قيود**. تسجيل الدخول بـ Google بس هو اللي فيه استثناء واحد: مش بيشتغل لو حد فاتح الموقع من جوه متصفح تطبيق تاني (زي واتساب أو انستجرام) — ده قرار من جوجل نفسه ومفيش حل بالكود ليه، والموقع بيوضح للمستخدم إنه يفتح الرابط في Safari/Chrome بدالها تلقائيًا
3. من Build > Firestore Database: اعمل قاعدة بيانات جديدة (Start in production mode)
4. من Project Settings > General > Your apps: اعمل Web App جديدة، وهتاخد منها الـ config
5. حط القيم دي في ملف `.env.local` (اعمل نسخة من `.env.example`):
   ```
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=...
   VITE_FIREBASE_PROJECT_ID=...
   VITE_FIREBASE_STORAGE_BUCKET=...
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=...
   ```
6. من Firestore > Rules: انسخ محتوى ملف `firestore.rules` الموجود في المشروع وحطه بدل الـ rules الافتراضية، وانشرها (Publish).

### تحديد أول Super Admin
1. سجّل حساب عادي من صفحة "Create Account" في الموقع.
2. روح على Firestore Console > collection `users` > هتلاقي مستند بالـ UID بتاعك.
3. غيّر فيلد `role` من `"user"` لـ `"superadmin"` يدويًا.
4. رجّع تسجل دخول (أو ريفريش) — هتلاقي "Admin Panel" ظهر في الـ Navbar ومعاه تاب "Manage Admins".

من هنا، الـ Super Admin ده هو بس اللي يقدر يخلي أي حد تاني Admin من صفحة "Manage Admins".

---

> **لو شغلت الموقع قبل ما تحط بيانات Firebase**: مش هتشوف صفحة بيضة فاضية تاني — هتلاقي شاشة "Setup Required" واضحة بتقولك بالظبط إيه الناقص. لسة ماحصلش أي حاجة غلط، ده متوقع لحد ما تخلص خطوة (5) و(6) تحت.

## 3) تشغيل المشروع محليًا

```bash
npm install
npm run dev
```

> **لو ظهرلك error زي `'vite' is not recognized`**: ده معناه إن `npm install` إما ماتنفذش أو اتنفذ في مجلد غلط.
> تأكد إنك واقف بالظبط جوه المجلد اللي فيه `package.json` (اعمل `dir` وشوف إنه ظاهر)، وإن مجلد `node_modules` اتعمل فعلاً بعد الـ install. لو المشروع كان متفكوك (unzip) جوه مجلد جوه مجلد بنفس الاسم بالغلط، ادخل للمجلد الصح اللي فيه `package.json` مباشرة وجرب تاني.

## 4) هل الـ Firebase config (API Key) لازم يتخبى؟

لأ — ومفيش طريقة تخبيه أصلًا لو الموقع شغال على متصفح المستخدم (React/Vite زي أي Frontend تاني)، لأن المتصفح لازم يكون عنده القيم دي عشان يقدر يكلم Firebase. ده طبيعي وكل المواقع اللي شغالة بـ Firebase كده، بما فيهم مواقع كبيرة.

**اللي فعليًا بيحميك مش إخفاء الـ API Key، ده الحاجتين دول:**

1. **Firestore Security Rules** (ملف `firestore.rules` اللي نشرته بالفعل): دي اللي بتحدد مين يقدر يقرا/يكتب/يعدل/يحذف كل collection — مش الـ API Key. حتى لو حد شاف الـ Key، مش هيقدر يعمل حاجة غير اللي الـ Rules سامحة بيه (زي إنه يقرا الـ launches بس، ومايقدرش يقرا contactSubmissions غير لو Admin).
2. **Authorized domains** (في Authentication > Settings): بتحدد مين الدومينز اللي تقدر تستخدم تسجيل الدخول بتاعك.

يعني خلاصة الأمر: ارفع المشروع عادي على GitHub وحط فيه الـ config زي ما هو، بس **تأكد إن الـ Rules منشورة صح** (زي ما عملنا) — ده اللي بيحمي بياناتك فعليًا مش إخفاء الملف.

---

## 5) الرفع على GitHub

1. لو معندكش حساب، اعمل واحد على [github.com](https://github.com)
2. من الموقع، دوس "+" فوق يمين → "New repository"
3. سمّيه `reach-the-launch` → سيبه Public أو Private براحتك → "Create repository"
4. افتح Terminal جوه VS Code (Terminal > New Terminal) وأنت واقف في مجلد المشروع، واكتب:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/USERNAME/reach-the-launch.git
   git push -u origin main
   ```
   (غيّر `USERNAME` باسم حسابك على GitHub، وهيطلب منك تسجل دخول أول مرة)
5. ملف `.gitignore` الموجود بالفعل هيمنع رفع `.env.local` و `node_modules` تلقائيًا — متقلقش، الـ Firebase keys مش هترفع على GitHub أصلًا حتى لو حبيت (وده كويس كممارسة حتى لو مش سر حرج)

## 6) الرفع على Vercel (مجانًا بالكامل)

1. روح [vercel.com](https://vercel.com) وسجل دخول بحساب GitHub بتاعك (زرار "Continue with GitHub")
2. دوس "Add New..." → "Project"
3. هيظهرلك الريبو `reach-the-launch` — دوس "Import"
4. قبل ما تدوس Deploy، افتح قسم "**Environment Variables**" وضيف الـ 6 متغيرات (نفس اللي في `.env.local` بتاعك):
   ```
   VITE_FIREBASE_API_KEY
   VITE_FIREBASE_AUTH_DOMAIN
   VITE_FIREBASE_PROJECT_ID
   VITE_FIREBASE_STORAGE_BUCKET
   VITE_FIREBASE_MESSAGING_SENDER_ID
   VITE_FIREBASE_APP_ID
   ```
5. دوس "**Deploy**" — استنى دقيقة أو اتنين
6. هيديك رابط زي `reach-the-launch.vercel.app` — الموقع شغال لايف عليه

**آخر خطوة مهمة جدًا:** ارجع Firebase Console > Authentication > Settings > Authorized domains، وضيف نفس الدومين اللي Vercel ديته ليك (`reach-the-launch.vercel.app`) — من غيرها تسجيل الدخول (خصوصًا Google) مش هيشتغل على الموقع اللايف.

---

## 7) لازم تنشر الـ Rules المحدّثة كل مرة تتغير

ملف `firestore.rules` اتغيّر أكتر من مرة (نظام الصلاحيات، الـ Special Offer، رقم الواتساب). لو أول مرة تعمل الخطوات دي من الملف ده، انسخ محتوى `firestore.rules` كامل والصقه في Firebase Console → Firestore Database → **Rules** → Publish. لو مش متأكد إنه محدّث، انسخه تاني — مفيش ضرر من إعادة النشر.

---

## 8) الـ SEO (الظهور في نتائج البحث)

المشروع فيه دلوقتي كل الأساسيات التقنية للـ SEO:
- عنوان ووصف مخصص لكل صفحة (الرئيسية، كل Launch، كل Developer) بالعربي والإنجليزي
- خانة "SEO Keywords" في فورم إضافة/تعديل أي Launch — أي كلمة تكتبها هناك (عربي أو إنجليزي) بتتحط في الصفحة نفسها وبتساعد جوجل يربط الصفحة دي بالبحث ده
- `robots.txt` و `sitemap.xml` (لازم تعدلهم بالدومين الحقيقي بتاعك بعد ما تربطه، شرح تحت)
- بيانات JSON-LD (Schema.org) للموقع نفسه

### حاجات لازم تعملها انت (مش حاجة تقدر تحطها بالكود بس):

1. **اربط دومين حقيقي بدل الـ vercel.app**: دومين زي `reachthelaunch.com` بيساعد كتير جدًا لما حد يدور بالظبط على اسم "Reach The Launch" إنه يطلعلك في الأول. من Vercel → مشروعك → Settings → Domains.

2. **بعد ما تربط الدومين**، افتح الملفين دول وغيّر `YOUR-DOMAIN-HERE` بالدومين الحقيقي بتاعك:
   - `public/robots.txt`
   - `public/sitemap.xml`

3. **سجّل الموقع في Google Search Console** ([search.google.com/search-console](https://search.google.com/search-console)):
   - ضيف الدومين بتاعك، اعمل التحقق من الملكية (بيديك طريقة سهلة زي DNS record)
   - قدّم رابط الـ sitemap بتاعك (`https://your-domain.com/sitemap.xml`)
   - ده اللي فعليًا بيخلي جوجل يعرف بوجود موقعك ويبدأ يفهرسه

4. **الظهور الأول في نتائج البحث مش حاجة مضمونة فورًا من حد** — حتى بأفضل SEO، جوجل بياخد وقت (أسابيع لحد شهور) عشان يفهرس ويرتب موقع جديد، خصوصًا للاسم بالظبط لو مفيش موقع تاني منافس بنفس الاسم غالبًا هتطلع في الأول أو قريب منه مع الوقت. الحاجات اللي عملتها فوق بتدي أفضل فرصة ممكنة، لكن الترتيب النهائي قرار جوجل مش حاجة أي حد يقدر يضمنها 100%.

5. لكل Launch جديد تضيفه، **املأ خانة SEO Keywords بكل الكلمات المحتملة** (عربي وإنجليزي، اسم المنطقة، نوع الوحدة، اسم الديفلوبر) — دي أكبر حاجة تقدر تتحكم فيها لتحسين ظهور المشروع ده تحديدًا في البحث.

---

## 9) هيكل البيانات (Firestore Collections)

- **launches**: name, developerId, developerName, region (east/west/sahel/sokhna), coverImage, gallery[], priceStart, launchStart, launchEnd, bestTimeToBuy, unitTypes[], description, keywords[]
- **developers**: name, logo, description
- **users**: name, email, phone, role (user/admin/superadmin), permissions {launches, developers, submissions, offers}
- **contactSubmissions**: name, phone, unitType, preferredDate (optional), launchId (nullable = عام), launchName, userId, userEmail, done
- **settings/specialOffer**: بانر العرض الخاص في الصفحة الرئيسية
- **settings/whatsapp**: رقم الواتساب اللي بيظهر للعملاء

---

## 10) الأخطاء اللي كانت في مواقع زي Nawy وعالجناها هنا

- **مفيش فلترة حقيقية بالمنطقة + الديفلوبر مع بعض**: هنا اخترت منطقة، تظهرلك المشاريع اللي فيها بس، ومعاها اختيار Developer واحد داخل نفس المنطقة بالظبط.
- **صفحة الديفلوبر بتخلط مشاريع ديفلوبرز تانيين أحيانًا**: هنا صفحة كل ديفلوبر معزولة تمامًا وبتجيب مشاريعه هو بس (query بالـ developerId).
- **الـ Carousel ثابت أو Static (مش بيتحدث لوحده)**: هنا الكاروسيل ديناميكي 100% وبيعرض كل الـ Launches الموجودة فعليًا في قاعدة البيانات لحظيًا.
- **مفيش تمييز واضح بين Launch جديد ومشروع قديم عادي**: الموقع كله مبني على فكرة إن كل حاجة فيه Launch، ومعاه Highlight واضح لـ "Best Time to Buy".
- **الـ Contact Us مش موحّد**: هنا نفس الفورم شغالة في حالتين (لمشروع معين، أو Contact عام من الـ Navbar) وبتتخزن في مكان واحد يقدر الأدمن يشوفه كله.
- **صفحة فاضية أو Crash لو مفيش بيانات**: كل صفحة هنا (Carousel, Launches, Developers) بتتعامل مع حالة "مفيش بيانات" برسالة واضحة بدل ما تعمل كراش أو تفضل فاضية غريبة.
