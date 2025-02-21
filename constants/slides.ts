import { Slide } from "@/app/onboarding";

export const slides: Slide[] = [
  {
    type: 'choice',
    title: "What's your gender?",
    field: 'gender',
    choices: [
      "Male",
      "Female"
    ],
    validation: (value: string) => value.length > 0
  },
  {
    type: 'date',
    title: "When's your birthday?",
    field: 'birthDate',
    validation: (value: string) => {
      const date = new Date(value);
      const minDate = new Date(1900, 0, 1);
      const maxDate = new Date();
      return date >= minDate && date <= maxDate;
    }
  },
  {
    type: 'measurement',
    title: "What are your height and weight?",
    field: 'measurements',
    validation: (value: string) => {
      const [height, weight, heightUnit, weightUnit] = value.split(',');
      return !!height && !!weight && !!heightUnit && !!weightUnit;
    }
  },
  {
    type: 'choice',
    title: "What's your experience level?",
    field: 'experience',
    choices: [
      "Beginner - New to working out",
      "Intermediate - Some experience",
      "Advanced - Regular workout routine",
      "Expert - Years of experience"
    ],
    validation: (value: string) => value.length > 0
  },
  {
    type: 'choice',
    title: "What's your fitness goal?",
    field: 'goal',
    choices: [
      "Build Muscle - Gain strength and size",
      "Lose Weight - Burn fat and get lean",
      "Stay Fit - Maintain current fitness",
      "Improve Health - Better overall wellness"
    ],
    validation: (value: string) => value.length > 0
  },
  {
    type: 'choice',
    title: "How often do you work out?",
    field: 'frequency',
    choices: [
      "2-3 times per week",
      "3-4 times per week",
      "4-5 times per week",
      "6+ times per week"
    ],
    validation: (value: string) => value.length > 0
  },
];