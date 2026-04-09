import { useEffect, useMemo, useState } from "react";
import RobotMascot from "./RobotMascot";
import { formatBusStop, formatLockerName, getCrowdingScore, matchesSearch } from "../utils/lockerUtils";

const quickQuestions = [
  { id: "large", labelKey: "assistantQuickLarge" },
  { id: "nearest", labelKey: "assistantQuickNearest" },
  { id: "alternative", labelKey: "assistantQuickAlternative" },
  { id: "bus", labelKey: "assistantQuickBus" }
];

function fillTemplate(template, values) {
  return Object.entries(values).reduce(
    (text, [key, value]) => text.replaceAll(`{${key}}`, value),
    template
  );
}

function sortByAvailability(lockers) {
  return [...lockers].sort((a, b) => {
    if (a.availabilityStatus === "Full" && b.availabilityStatus !== "Full") return 1;
    if (a.availabilityStatus !== "Full" && b.availabilityStatus === "Full") return -1;
    return getCrowdingScore(a) - getCrowdingScore(b);
  });
}

function inferQuestionType(question) {
  const normalized = question.toLowerCase();

  if (/large|carrier|luggage|대형|캐리어|荷物|大型|行李|大件/.test(normalized)) {
    return "large";
  }

  if (/bus|버스|バス|公交|公共交通/.test(normalized)) {
    return "bus";
  }

  if (/full|crowd|alternative|대체|혼잡|가득|꽉|空き|代替|满|替代/.test(normalized)) {
    return "alternative";
  }

  return "nearest";
}

function getFocusedPool(lockers, selectedLocker, question) {
  const availableLockers = lockers.filter((locker) => locker.availabilityStatus !== "Full");
  const searchPool = availableLockers.length > 0 ? availableLockers : lockers;
  const trimmedQuestion = question.trim();
  const directQuestionMatches = trimmedQuestion
    ? searchPool.filter((locker) => matchesSearch(locker, trimmedQuestion))
    : [];
  const sameLandmarkPool =
    selectedLocker && searchPool.some((locker) => locker.nearbyLandmark === selectedLocker.nearbyLandmark)
      ? searchPool.filter((locker) => locker.nearbyLandmark === selectedLocker.nearbyLandmark)
      : [];
  const sameRegionPool =
    selectedLocker && searchPool.some((locker) => locker.region === selectedLocker.region)
      ? searchPool.filter((locker) => locker.region === selectedLocker.region)
      : searchPool;

  if (directQuestionMatches.length > 0) return directQuestionMatches;
  if (sameLandmarkPool.length > 0) return sameLandmarkPool;
  return sameRegionPool;
}

function getRecommendation(type, lockers, selectedLocker, question = "") {
  const searchPool = getFocusedPool(lockers, selectedLocker, question);

  if (type === "large") {
    const largePool = searchPool.filter((locker) => locker.largeLuggage);
    if (largePool.length > 0) {
      return sortByAvailability(largePool)[0] ?? null;
    }

    return sortByAvailability(lockers.filter((locker) => locker.largeLuggage))[0] ?? null;
  }

  if (type === "bus") {
    return [...searchPool].sort((a, b) => a.estimatedBusMinutes - b.estimatedBusMinutes)[0] ?? null;
  }

  if (type === "alternative") {
    const alternativePool = searchPool.filter((locker) => locker.id !== selectedLocker?.id);
    if (alternativePool.length > 0) {
      return sortByAvailability(alternativePool)[0] ?? null;
    }

    return (
      sortByAvailability(
        lockers
          .filter((locker) => locker.availabilityStatus !== "Full")
          .filter((locker) => locker.id !== selectedLocker?.id)
      )[0] ?? null
    );
  }

  return [...searchPool].sort((a, b) => a.estimatedWalkMinutes - b.estimatedWalkMinutes)[0] ?? null;
}

function buildAnswer(type, locker, t) {
  if (!locker) {
    return t.assistantNoResult;
  }

  const template = {
    large: t.assistantAnswerLarge,
    nearest: t.assistantAnswerNearest,
    alternative: t.assistantAnswerAlternative,
    bus: t.assistantAnswerBus
  }[type];

  return fillTemplate(template, {
    name: formatLockerName(locker, t),
    available: locker.availableUnits,
    total: locker.totalUnits,
    walk: locker.estimatedWalkMinutes,
    bus: locker.estimatedBusMinutes,
    stop: formatBusStop(locker.nearestBusStop, t)
  });
}

export default function LockerAssistant({ t, lockers, selectedLocker, onSelectLocker }) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([
    {
      id: "initial",
      role: "assistant",
      text: t.assistantInitial,
      locker: selectedLocker
    }
  ]);

  useEffect(() => {
    setMessages([
      {
        id: "initial",
        role: "assistant",
        text: t.assistantInitial,
        locker: selectedLocker
      }
    ]);
  }, [t]);

  function askAssistant(type, label) {
    const recommendedLocker = getRecommendation(type, lockers, selectedLocker, label);
    const nextMessages = [
      {
        id: `user-${Date.now()}`,
        role: "user",
        text: label
      },
      {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        text: buildAnswer(type, recommendedLocker, t),
        locker: recommendedLocker
      }
    ];

    setMessages((currentMessages) => [...currentMessages, ...nextMessages].slice(-6));

    if (recommendedLocker) {
      onSelectLocker(recommendedLocker);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion) return;

    askAssistant(inferQuestionType(trimmedQuestion), trimmedQuestion);
    setQuestion("");
  }

  return (
    <section id="tourist" className="bg-white py-14">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
        <div className="rounded-[2rem] bg-civic-900 p-6 text-white shadow-civic">
          <div className="mb-6">
            <RobotMascot message={t.assistantMascotGreeting ?? t.assistantInitial} />
          </div>
          <p className="font-soft text-sm uppercase tracking-[0.2em] text-transit-300">
            {t.assistantEyebrow}
          </p>
          <h2 className="mt-4 font-display font-semibold text-3xl tracking-tight sm:text-4xl">
            {t.assistantTitle}
          </h2>
          <p className="mt-4 font-soft leading-7 text-civic-100">{t.assistantText}</p>

          <div className="mt-8 grid gap-3">
            {quickQuestions.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => askAssistant(item.id, t[item.labelKey])}
                className="focus-ring rounded-2xl bg-white/10 px-4 py-3 text-left font-display text-sm font-semibold text-white ring-1 ring-white/15 transition hover:bg-white/20"
              >
                {t[item.labelKey]}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] bg-slate-50 p-4 shadow-sm ring-1 ring-slate-200 sm:p-6">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[88%] rounded-[1.5rem] p-4 text-sm leading-6 shadow-sm ${
                    message.role === "user"
                      ? "bg-civic-600 text-white"
                      : "bg-white text-slate-700 ring-1 ring-slate-200"
                  }`}
                >
                  <p className={message.role === "user" ? "font-display font-semibold" : "font-soft"}>
                    {message.text}
                  </p>
                  {message.locker && (
                    <button
                      type="button"
                      onClick={() => onSelectLocker(message.locker)}
                      className="focus-ring mt-3 rounded-full bg-transit-400/15 px-3 py-1 font-display text-xs font-semibold text-civic-700 hover:bg-transit-400/25"
                    >
                      {t.assistantViewLocker}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="mt-6 rounded-[1.5rem] bg-white p-3 ring-1 ring-slate-200">
            <label className="sr-only" htmlFor="assistant-question">
              {t.assistantInputLabel}
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                id="assistant-question"
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder={t.assistantPlaceholder}
                className="min-h-12 flex-1 rounded-2xl bg-slate-50 px-4 text-sm font-semibold text-slate-700 outline-none ring-1 ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-civic-500"
              />
              <button
                type="submit"
                className="focus-ring min-h-12 rounded-2xl bg-civic-600 px-5 font-display text-sm font-semibold text-white hover:bg-civic-700"
              >
                {t.assistantSend}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
