/* state.js — global state object + curriculum
   Auto-extracted from the original single-file game; behaviour unchanged. */
const state={
hour:8,minute:0,dayName:'Pzt',dayOfMonth:20,
money:5000,akbil:80,abonman:false,abonmanTrips:0,abonmanDays:0,
energy:75,hygiene:80,hunger:50,mood:70,academic:0,
location:'Avcılar yurdu',
activeModal:null,pendingInvite:null,tasksExpanded:false,
toiletPaperPending:false,toiletPaperDays:0,toiletPaperSnoozed:false,
rentDue:1500,rentPaid:false,daysUntilRent:10,
daysSinceHaircut:5,daysSinceLaundry:0,
bankDebt:0,momLoanUsed:false,keremLoanUsed:false,
nextAllowanceDay:45,lastExtraAsk:null,
gano:null,
okeyWinRate:50,
iddiaLevel:0,freshHaircut:false,
gameBets:{seker:100,blackjack:100,iddia:100},
girlfriend:null,relationship:0,relationshipTimer:0,relationshipDays:0,
guzCourses:[
{code:'MTH101',name:'Matematik I',type:'ders',absent:0,max:4,credits:4,bilgi:0,guzVize:{month:11,day:15},guzFinal:{month:1,day:3},baharVize:null,baharFinal:null,guzVizeNote:null,guzFinalNote:null,baharVizeNote:null,baharFinalNote:null,schedule:[{day:'Pzt',start:9,end:12,room:'D-301'}]},
{code:'ATA111',name:'Atatürk İlk. ve İnk. Tarihi I',type:'ders',absent:0,max:4,credits:2,bilgi:0,guzVize:{month:11,day:22},guzFinal:{month:1,day:10},baharVize:null,baharFinal:null,guzVizeNote:null,guzFinalNote:null,baharVizeNote:null,baharFinalNote:null,schedule:[{day:'Pzt',start:13,end:15,room:'D-105'}]},
{code:'PHY101',name:'Fizik I',type:'ders',absent:0,max:4,credits:4,bilgi:0,guzVize:{month:11,day:16},guzFinal:{month:1,day:4},baharVize:null,baharFinal:null,guzVizeNote:null,guzFinalNote:null,baharVizeNote:null,baharFinalNote:null,schedule:[{day:'Sal',start:9,end:12,room:'D-201'}]},
{code:'PHY101L',name:'Fizik I lab',type:'lab',parentCode:'PHY101',absent:0,max:2,credits:1,bilgi:0,guzVize:null,guzFinal:null,baharVize:null,baharFinal:null,guzVizeNote:null,guzFinalNote:null,baharVizeNote:null,baharFinalNote:null,schedule:[{day:'Sal',start:13,end:15,room:'Lab-2'}]},
{code:'CSE101',name:'Bilgisayar Programlama I',type:'ders',absent:0,max:4,credits:4,bilgi:0,guzVize:{month:11,day:17},guzFinal:{month:1,day:5},baharVize:null,baharFinal:null,guzVizeNote:null,guzFinalNote:null,baharVizeNote:null,baharFinalNote:null,schedule:[{day:'Çar',start:9,end:12,room:'D-204'}]},
{code:'CSE101L',name:'Bil. Programlama I lab',type:'lab',parentCode:'CSE101',absent:0,max:2,credits:1,bilgi:0,guzVize:null,guzFinal:null,baharVize:null,baharFinal:null,guzVizeNote:null,guzFinalNote:null,baharVizeNote:null,baharFinalNote:null,schedule:[{day:'Çar',start:13,end:16,room:'Lab-1'}]},
{code:'COE101',name:'Bilgisayar Mühendisliğine Giriş',type:'ders',absent:0,max:4,credits:3,bilgi:0,guzVize:{month:11,day:18},guzFinal:{month:1,day:6},baharVize:null,baharFinal:null,guzVizeNote:null,guzFinalNote:null,baharVizeNote:null,baharFinalNote:null,schedule:[{day:'Per',start:9,end:12,room:'D-205'}]},
{code:'ENG151',name:'Akademik İngilizce I',type:'ders',absent:0,max:4,credits:3,bilgi:0,guzVize:{month:11,day:19},guzFinal:{month:1,day:7},baharVize:null,baharFinal:null,guzVizeNote:null,guzFinalNote:null,baharVizeNote:null,baharFinalNote:null,schedule:[{day:'Per',start:13,end:15,room:'D-302'}]},
{code:'TRD111',name:'Türk Dili I',type:'ders',absent:0,max:4,credits:2,bilgi:0,guzVize:{month:11,day:23},guzFinal:{month:1,day:11},baharVize:null,baharFinal:null,guzVizeNote:null,guzFinalNote:null,baharVizeNote:null,baharFinalNote:null,schedule:[{day:'Cum',start:9,end:11,room:'D-104'}]}
],
baharCourses:[
{code:'MTH102',name:'Matematik II',type:'ders',absent:0,max:4,credits:4,bilgi:0,guzVize:null,guzFinal:null,baharVize:{month:4,day:18},baharFinal:{month:6,day:13},guzVizeNote:null,guzFinalNote:null,baharVizeNote:null,baharFinalNote:null,schedule:[{day:'Pzt',start:9,end:12,room:'D-301'}]},
{code:'ATA112',name:'Atatürk İlk. ve İnk. Tarihi II',type:'ders',absent:0,max:4,credits:2,bilgi:0,guzVize:null,guzFinal:null,baharVize:{month:4,day:25},baharFinal:{month:6,day:20},guzVizeNote:null,guzFinalNote:null,baharVizeNote:null,baharFinalNote:null,schedule:[{day:'Pzt',start:13,end:15,room:'D-105'}]},
{code:'PHY102',name:'Fizik II',type:'ders',absent:0,max:4,credits:4,bilgi:0,guzVize:null,guzFinal:null,baharVize:{month:4,day:19},baharFinal:{month:6,day:14},guzVizeNote:null,guzFinalNote:null,baharVizeNote:null,baharFinalNote:null,schedule:[{day:'Sal',start:9,end:12,room:'D-201'}]},
{code:'PHY102L',name:'Fizik II lab',type:'lab',parentCode:'PHY102',absent:0,max:2,credits:1,bilgi:0,guzVize:null,guzFinal:null,baharVize:null,baharFinal:null,guzVizeNote:null,guzFinalNote:null,baharVizeNote:null,baharFinalNote:null,schedule:[{day:'Sal',start:13,end:15,room:'Lab-2'}]},
{code:'CSE102',name:'Bilgisayar Programlama II',type:'ders',absent:0,max:4,credits:4,bilgi:0,guzVize:null,guzFinal:null,baharVize:{month:4,day:20},baharFinal:{month:6,day:15},guzVizeNote:null,guzFinalNote:null,baharVizeNote:null,baharFinalNote:null,schedule:[{day:'Çar',start:9,end:12,room:'D-204'}]},
{code:'CSE102L',name:'Bil. Programlama II lab',type:'lab',parentCode:'CSE102',absent:0,max:2,credits:1,bilgi:0,guzVize:null,guzFinal:null,baharVize:null,baharFinal:null,guzVizeNote:null,guzFinalNote:null,baharVizeNote:null,baharFinalNote:null,schedule:[{day:'Çar',start:13,end:16,room:'Lab-1'}]},
{code:'COE104',name:'Mühendislik Tarihi',type:'ders',absent:0,max:4,credits:3,bilgi:0,guzVize:null,guzFinal:null,baharVize:{month:4,day:21},baharFinal:{month:6,day:16},guzVizeNote:null,guzFinalNote:null,baharVizeNote:null,baharFinalNote:null,schedule:[{day:'Per',start:9,end:12,room:'D-205'}]},
{code:'ENG152',name:'Akademik İngilizce II',type:'ders',absent:0,max:4,credits:3,bilgi:0,guzVize:null,guzFinal:null,baharVize:{month:4,day:22},baharFinal:{month:6,day:17},guzVizeNote:null,guzFinalNote:null,baharVizeNote:null,baharFinalNote:null,schedule:[{day:'Per',start:13,end:15,room:'D-302'}]},
{code:'TRD112',name:'Türk Dili II',type:'ders',absent:0,max:4,credits:2,bilgi:0,guzVize:null,guzFinal:null,baharVize:{month:4,day:26},baharFinal:{month:6,day:21},guzVizeNote:null,guzFinalNote:null,baharVizeNote:null,baharFinalNote:null,schedule:[{day:'Cum',start:9,end:11,room:'D-104'}]},
{code:'CPL102',name:'Kariyer Planlama',type:'ders',absent:0,max:4,credits:2,bilgi:0,guzVize:null,guzFinal:null,baharVize:{month:4,day:27},baharFinal:{month:6,day:22},guzVizeNote:null,guzFinalNote:null,baharVizeNote:null,baharFinalNote:null,schedule:[{day:'Cum',start:13,end:15,room:'D-106'}]}
],
guzEnded:false,baharEnded:false,
avatarId:null,
playerName:null,
playerLastName:null,
gender:null,
semester:'guz',
scheduleView:'program',
friends:JSON.parse(JSON.stringify(FRIENDS_ERKEK)),
dates:[
{id:'selin',name:'Selin',age:18,color:'#D4537E',dept:'Halkla ilişkiler 1',tag:'Parti aslanı, Beyoğlu kraliçesi, sabaha kadar dans',affinity:10,cost:700},
{id:'ece',name:'Ece',age:18,color:'#A32D2D',dept:'İktisat 1',tag:'Akıllı, hırslı, çalışkan',affinity:20,cost:500},
{id:'irem',name:'İrem',age:19,color:'#D4A155',dept:'Bilkent işletme 1',tag:'Aşırı zengin, lüks marka düşkünü',affinity:0,cost:1500},
{id:'lara',name:'Lara',age:18,color:'#1A1109',dept:'Görsel sanatlar 1',tag:'Gothic, edgy, gizemli',affinity:10,cost:600},
{id:'berna',name:'Berna',age:19,color:'#5C3317',dept:'Edebiyat 2',tag:'Kitap kurdu, gözlüklü, naif',affinity:25,cost:350},
{id:'zeynep',name:'Zeynep',age:18,color:'#185FA5',dept:'Spor bilimleri 1',tag:'Voleybol kaptanı, atletik',affinity:20,cost:300},
{id:'asya',name:'Asya',age:18,color:'#C2410C',dept:'Siyaset bilimi 1',tag:'Feminist, bilinçli, sosyal',affinity:5,cost:450},
{id:'sumeyye',name:'Sümeyye',age:18,color:'#1D9E75',dept:'Endüstri müh. 1',tag:'Tesettürlü, mütevazi, çalışkan',affinity:18,cost:400}
],
guzCoursesKiz:[
{code:'HUK101',name:'Anayasa Hukukunun Genel Esasları',type:'ders',absent:0,max:4,credits:4,bilgi:0,guzVize:{month:11,day:15},guzFinal:{month:1,day:3},baharVize:null,baharFinal:null,guzVizeNote:null,guzFinalNote:null,baharVizeNote:null,baharFinalNote:null,schedule:[{day:'Pzt',start:9,end:12,room:'Amfi 1'}]},
{code:'ATA101',name:'Atatürk İlk. ve İnk. Tarihi I',type:'ders',absent:0,max:4,credits:2,bilgi:0,guzVize:{month:11,day:22},guzFinal:{month:1,day:10},baharVize:null,baharFinal:null,guzVizeNote:null,guzFinalNote:null,baharVizeNote:null,baharFinalNote:null,schedule:[{day:'Pzt',start:13,end:15,room:'Amfi 2'}]},
{code:'HUK111',name:'Hukuk Felsefesi (Seçmeli)',type:'ders',absent:0,max:4,credits:2,bilgi:0,guzVize:{month:11,day:24},guzFinal:{month:1,day:12},baharVize:null,baharFinal:null,guzVizeNote:null,guzFinalNote:null,baharVizeNote:null,baharFinalNote:null,schedule:[{day:'Sal',start:9,end:11,room:'D-104'}]},
{code:'HUK105',name:'Roma Hukuku I',type:'ders',absent:0,max:4,credits:2,bilgi:0,guzVize:{month:11,day:16},guzFinal:{month:1,day:4},baharVize:null,baharFinal:null,guzVizeNote:null,guzFinalNote:null,baharVizeNote:null,baharFinalNote:null,schedule:[{day:'Sal',start:13,end:15,room:'D-202'}]},
{code:'HUK103',name:'Medeni Hukuka Giriş ve Kişiler Hukuku',type:'ders',absent:0,max:4,credits:4,bilgi:0,guzVize:{month:11,day:17},guzFinal:{month:1,day:5},baharVize:null,baharFinal:null,guzVizeNote:null,guzFinalNote:null,baharVizeNote:null,baharFinalNote:null,schedule:[{day:'Çar',start:9,end:12,room:'Amfi 1'}]},
{code:'HUK107',name:'Hukuk Başlangıcı',type:'ders',absent:0,max:4,credits:3,bilgi:0,guzVize:{month:11,day:18},guzFinal:{month:1,day:6},baharVize:null,baharFinal:null,guzVizeNote:null,guzFinalNote:null,baharVizeNote:null,baharFinalNote:null,schedule:[{day:'Per',start:9,end:12,room:'Amfi 2'}]},
{code:'HUK109',name:'Kariyer Planlama',type:'ders',absent:0,max:4,credits:1,bilgi:0,guzVize:{month:11,day:19},guzFinal:{month:1,day:7},baharVize:null,baharFinal:null,guzVizeNote:null,guzFinalNote:null,baharVizeNote:null,baharFinalNote:null,schedule:[{day:'Per',start:13,end:14,room:'D-105'}]},
{code:'TRD101',name:'Türk Dili I',type:'ders',absent:0,max:4,credits:2,bilgi:0,guzVize:{month:11,day:23},guzFinal:{month:1,day:11},baharVize:null,baharFinal:null,guzVizeNote:null,guzFinalNote:null,baharVizeNote:null,baharFinalNote:null,schedule:[{day:'Cum',start:9,end:11,room:'D-104'}]},
{code:'HUK113',name:'Hukuk Sosyolojisi (Seçmeli)',type:'ders',absent:0,max:4,credits:2,bilgi:0,guzVize:{month:11,day:25},guzFinal:{month:1,day:13},baharVize:null,baharFinal:null,guzVizeNote:null,guzFinalNote:null,baharVizeNote:null,baharFinalNote:null,schedule:[{day:'Cum',start:13,end:15,room:'D-202'}]}
],
baharCoursesKiz:[
{code:'HUK102',name:'Türk Anayasa Hukuku',type:'ders',absent:0,max:4,credits:4,bilgi:0,guzVize:null,guzFinal:null,baharVize:{month:4,day:18},baharFinal:{month:6,day:13},guzVizeNote:null,guzFinalNote:null,baharVizeNote:null,baharFinalNote:null,schedule:[{day:'Pzt',start:9,end:12,room:'Amfi 1'}]},
{code:'ATA102',name:'Atatürk İlk. ve İnk. Tarihi II',type:'ders',absent:0,max:4,credits:2,bilgi:0,guzVize:null,guzFinal:null,baharVize:{month:4,day:25},baharFinal:{month:6,day:20},guzVizeNote:null,guzFinalNote:null,baharVizeNote:null,baharFinalNote:null,schedule:[{day:'Pzt',start:13,end:15,room:'Amfi 2'}]},
{code:'HUK110',name:'Mantık (Seçmeli)',type:'ders',absent:0,max:4,credits:3,bilgi:0,guzVize:null,guzFinal:null,baharVize:{month:4,day:28},baharFinal:{month:6,day:23},guzVizeNote:null,guzFinalNote:null,baharVizeNote:null,baharFinalNote:null,schedule:[{day:'Sal',start:9,end:12,room:'D-104'}]},
{code:'HUK106',name:'Roma Hukuku II',type:'ders',absent:0,max:4,credits:2,bilgi:0,guzVize:null,guzFinal:null,baharVize:{month:4,day:19},baharFinal:{month:6,day:14},guzVizeNote:null,guzFinalNote:null,baharVizeNote:null,baharFinalNote:null,schedule:[{day:'Sal',start:13,end:15,room:'D-202'}]},
{code:'HUK104',name:'Aile Hukuku',type:'ders',absent:0,max:4,credits:4,bilgi:0,guzVize:null,guzFinal:null,baharVize:{month:4,day:20},baharFinal:{month:6,day:15},guzVizeNote:null,guzFinalNote:null,baharVizeNote:null,baharFinalNote:null,schedule:[{day:'Çar',start:9,end:12,room:'Amfi 1'}]},
{code:'HUK108',name:'İktisada Giriş',type:'ders',absent:0,max:4,credits:3,bilgi:0,guzVize:null,guzFinal:null,baharVize:{month:4,day:21},baharFinal:{month:6,day:16},guzVizeNote:null,guzFinalNote:null,baharVizeNote:null,baharFinalNote:null,schedule:[{day:'Per',start:9,end:12,room:'Amfi 2'}]},
{code:'TRD102',name:'Türk Dili II',type:'ders',absent:0,max:4,credits:2,bilgi:0,guzVize:null,guzFinal:null,baharVize:{month:4,day:26},baharFinal:{month:6,day:21},guzVizeNote:null,guzFinalNote:null,baharVizeNote:null,baharFinalNote:null,schedule:[{day:'Cum',start:9,end:11,room:'D-104'}]},
{code:'HUK112',name:'Hukuk Tarihi (Seçmeli)',type:'ders',absent:0,max:4,credits:2,bilgi:0,guzVize:null,guzFinal:null,baharVize:{month:4,day:27},baharFinal:{month:6,day:22},guzVizeNote:null,guzFinalNote:null,baharVizeNote:null,baharFinalNote:null,schedule:[{day:'Cum',start:13,end:15,room:'D-202'}]}
],
datesKiz:[
{id:'demir',name:'Demir',age:21,color:'#1F5A5F',dept:'İstanbul Tıp 3',tag:'Tıpçı abi, kahveci, entelektüel',affinity:15,cost:800},
{id:'arda',name:'Arda',age:20,color:'#4A2C7A',dept:'İTÜ Bilgisayar Müh. 2',tag:'Mühendis abi, kampüsün gözdesi',affinity:25,cost:500},
{id:'ege',name:'Ege',age:18,color:'#1E3A8A',dept:'Boğaziçi İktisat 1',tag:'Çalışkan, kitap kurdu, sessiz',affinity:30,cost:350},
{id:'cem',name:'Cem',age:21,color:'#8B1A1A',dept:'Koç İşletme 3',tag:'Aşırı zengin, Ferrari, lüks marka',affinity:0,cost:2500},
{id:'berkay',name:'Berkay',age:20,color:'#4D5C2B',dept:'Marmara BESYO 2',tag:'Antrenör adayı, fit, atletik',affinity:20,cost:400},
{id:'tolga',name:'Tolga',age:21,color:'#1A1109',dept:'Mimar Sinan Felsefe 3',tag:'Gothic, anarşist, alternatif',affinity:5,cost:250},
{id:'yusuf',name:'Yusuf',age:20,color:'#5C3317',dept:'Marmara Sanat Tarihi 2',tag:'Mütevazı, dindar, Eyüplü',affinity:22,cost:200},
{id:'sinan',name:'Sinan',age:26,color:'#845410',dept:'Karaköy bar · barmen',tag:'Dövmeli, abi, yaşı büyük, tehlikeli',affinity:8,cost:600}
]
};
state.courses=state.guzCourses;
