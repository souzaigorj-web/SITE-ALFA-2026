export type Plan = {
  speed: string;
  price: string;
  highlight?: boolean;
};

export const plans: Plan[] = [
  {
    speed: '750 Mega',
    price: 'R$ 99,90/mês',
  },
  {
    speed: '850 Mega',
    price: 'R$ 119,90/mês',
    highlight: true,
  },
  {
    speed: '1 Giga',
    price: 'R$ 149,90/mês',
  },
];
