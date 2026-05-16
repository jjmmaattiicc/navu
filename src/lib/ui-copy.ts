import type { Locale } from "@/lib/i18n";
import { TRUST_LINES } from "@/lib/trust-lines";

export type UiStrings = {
  trustLine: string;
  durationLine: string;
  backButton: string;
  inputPlaceholder: string;
};

const en: UiStrings = {
  trustLine: TRUST_LINES.en,
  durationLine: "Usually 10-15 minutes. You'll leave with clarity.",
  backButton: "Back",
  inputPlaceholder: "Write freely...",
};

const strings: Partial<Record<Locale, UiStrings>> = {
  en,
  hr: {
    trustLine: TRUST_LINES.hr,
    durationLine: "Obično 10-15 minuta. Otići ćete s jasnoćom.",
    backButton: "Natrag",
    inputPlaceholder: "Pišite slobodno...",
  },
  de: {
    trustLine:
      "Keine falschen Antworten. Kein Urteil. Nur du und deine Gedanken.",
    durationLine: "Meist 10-15 Minuten. Du gehst mit Klarheit.",
    backButton: "Zurück",
    inputPlaceholder: "Schreib frei...",
  },
  es: {
    trustLine:
      "No hay respuestas incorrectas. Sin juicios. Solo tú y tus pensamientos.",
    durationLine: "Suele durar 10-15 minutos. Saldrás con claridad.",
    backButton: "Volver",
    inputPlaceholder: "Escribe con libertad...",
  },
  fr: {
    trustLine:
      "Pas de mauvaises réponses. Pas de jugement. Juste vous et vos pensées.",
    durationLine: "Environ 10-15 minutes. Vous repartirez avec de la clarté.",
    backButton: "Retour",
    inputPlaceholder: "Écrivez librement...",
  },
  it: {
    trustLine:
      "Nessuna risposta sbagliata. Nessun giudizio. Solo tu e i tuoi pensieri.",
    durationLine: "Di solito 10-15 minuti. Uscirai con chiarezza.",
    backButton: "Indietro",
    inputPlaceholder: "Scrivi liberamente...",
  },
  pt: {
    trustLine:
      "Não há respostas erradas. Sem julgamentos. Só tu e os teus pensamentos.",
    durationLine: "Normalmente 10-15 minutos. Saís com clareza.",
    backButton: "Voltar",
    inputPlaceholder: "Escreve livremente...",
  },
  ru: {
    trustLine:
      "Нет неправильных ответов. Без осуждения. Только вы и ваши мысли.",
    durationLine: "Обычно 10-15 минут. Вы уйдёте с ясностью.",
    backButton: "Назад",
    inputPlaceholder: "Пишите свободно...",
  },
  pl: {
    trustLine:
      "Nie ma złych odpowiedzi. Bez osądu. Tylko ty i twoje myśli.",
    durationLine: "Zwykle 10-15 minut. Wyjdziesz z jasnością.",
    backButton: "Wstecz",
    inputPlaceholder: "Pisz swobodnie...",
  },
  nl: {
    trustLine:
      "Geen foute antwoorden. Geen oordeel. Alleen jij en je gedachten.",
    durationLine: "Meestal 10-15 minuten. Je vertrekt met helderheid.",
    backButton: "Terug",
    inputPlaceholder: "Schrijf vrijuit...",
  },
  tr: {
    trustLine:
      "Yanlış cevap yok. Yargı yok. Sadece sen ve düşüncelerin.",
    durationLine: "Genelde 10-15 dakika. Netlikle ayrılacaksın.",
    backButton: "Geri",
    inputPlaceholder: "Özgürce yaz...",
  },
  ar: {
    trustLine: "لا إجابات خاطئة. بلا حكم. أنت وأفكارك فقط.",
    durationLine: "عادة 10-15 دقيقة. ستغادر ومعك وضوح.",
    backButton: "رجوع",
    inputPlaceholder: "اكتب بحرية...",
  },
  zh: {
    trustLine: "没有错误的答案。没有评判。只有你和你的想法。",
    durationLine: "通常 10-15 分钟。你会带着清晰离开。",
    backButton: "返回",
    inputPlaceholder: "自由书写...",
  },
  "zh-TW": {
    trustLine: "沒有錯誤的答案。沒有評判。只有你和你的想法。",
    durationLine: "通常 10-15 分鐘。你會帶著清晰離開。",
    backButton: "返回",
    inputPlaceholder: "自由書寫...",
  },
  ja: {
    trustLine:
      "間違った答えはありません。判断はありません。あなたとあなたの考えだけ。",
    durationLine: "だいたい10〜15分。明確さを持って終われます。",
    backButton: "戻る",
    inputPlaceholder: "自由に書いてください...",
  },
  ko: {
    trustLine: "틀린 답은 없어요. 판단도 없어요. 오직 당신과 당신의 생각뿐.",
    durationLine: "보통 10-15분. 명확함을 가지고 나갈 거예요.",
    backButton: "뒤로",
    inputPlaceholder: "자유롭게 적어 보세요...",
  },
  sv: {
    trustLine:
      "Inga fel svar. Ingen dömer. Bara du och dina tankar.",
    durationLine: "Vanligtvis 10-15 minuter. Du lämnar med klarhet.",
    backButton: "Tillbaka",
    inputPlaceholder: "Skriv fritt...",
  },
  no: {
    trustLine: "Ingen gale svar. Ingen dømming. Bare du og tankene dine.",
    durationLine: "Vanligvis 10-15 minutter. Du går ut med klarhet.",
    backButton: "Tilbake",
    inputPlaceholder: "Skriv fritt...",
  },
  da: {
    trustLine: "Ingen forkerte svar. Ingen dømmekraft. Bare dig og dine tanker.",
    durationLine: "Som regel 10-15 minutter. Du går derfra med klarhed.",
    backButton: "Tilbage",
    inputPlaceholder: "Skriv frit...",
  },
  fi: {
    trustLine:
      "Ei vääriä vastauksia. Ei tuomitsemista. Vain sinä ja ajatuksesi.",
    durationLine: "Yleensä 10-15 minuuttia. Lähdet selkeydellä.",
    backButton: "Takaisin",
    inputPlaceholder: "Kirjoita vapaasti...",
  },
  uk: {
    trustLine:
      "Немає неправильних відповідей. Без осуду. Лише ви і ваші думки.",
    durationLine: "Зазвичай 10-15 хвилин. Ви підете з ясністю.",
    backButton: "Назад",
    inputPlaceholder: "Пишіть вільно...",
  },
};

export function getUiStrings(locale: Locale): UiStrings {
  const base = strings[locale] ?? en;
  return {
    ...base,
    trustLine: TRUST_LINES[locale] ?? TRUST_LINES.en,
  };
}
