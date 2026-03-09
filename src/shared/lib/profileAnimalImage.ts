import type { StaticImageData } from 'next/image';
import mBear from '@/assets/profile/m_bear.png';
import mCat from '@/assets/profile/m_cat.png';
import mDeer from '@/assets/profile/m_deer.png';
import mDessertFox from '@/assets/profile/m_dessertFox.png';
import mDino from '@/assets/profile/m_dino.png';
import mDog from '@/assets/profile/m_dog.png';
import mFox from '@/assets/profile/m_fox.png';
import mHamster from '@/assets/profile/m_hamster.png';
import mRabbit from '@/assets/profile/m_rabbit.png';
import mTiger from '@/assets/profile/m_tiger.png';
import mWolf from '@/assets/profile/m_wolf.png';
import wCat from '@/assets/profile/w_cat.png';
import wDeer from '@/assets/profile/w_deer.png';
import wDino from '@/assets/profile/w_dino.png';
import wDog from '@/assets/profile/w_dog.png';
import wFox from '@/assets/profile/w_fox.png';
import wHamster from '@/assets/profile/w_hamster.png';
import wRabbit from '@/assets/profile/w_rabbit.png';
import wTiger from '@/assets/profile/w_tiger.png';
import wTurtle from '@/assets/profile/w_turtle.png';
import wWolf from '@/assets/profile/w_wolf.png';

type GenderKey = 'm' | 'w';
type AnimalKey =
  | 'bear'
  | 'cat'
  | 'deer'
  | 'dessertfox'
  | 'dino'
  | 'dog'
  | 'fox'
  | 'hamster'
  | 'rabbit'
  | 'tiger'
  | 'turtle'
  | 'wolf';

const IMAGE_MAP: Record<GenderKey, Partial<Record<AnimalKey, StaticImageData>>> = {
  m: {
    bear: mBear,
    cat: mCat,
    deer: mDeer,
    dessertfox: mDessertFox,
    dino: mDino,
    dog: mDog,
    fox: mFox,
    hamster: mHamster,
    rabbit: mRabbit,
    tiger: mTiger,
    wolf: mWolf,
  },
  w: {
    cat: wCat,
    deer: wDeer,
    dino: wDino,
    dog: wDog,
    fox: wFox,
    hamster: wHamster,
    rabbit: wRabbit,
    tiger: wTiger,
    turtle: wTurtle,
    wolf: wWolf,
  },
};

const ANIMAL_ALIAS_TO_KEY: Record<string, AnimalKey> = {
  bear: 'bear',
  cat: 'cat',
  deer: 'deer',
  desertfox: 'dessertfox',
  dessertfox: 'dessertfox',
  dino: 'dino',
  dinosaur: 'dino',
  dog: 'dog',
  fox: 'fox',
  hamster: 'hamster',
  rabbit: 'rabbit',
  tiger: 'tiger',
  turtle: 'turtle',
  wolf: 'wolf',
  강아지: 'dog',
  고양이: 'cat',
  곰: 'bear',
  공룡: 'dino',
  늑대: 'wolf',
  사막여우: 'dessertfox',
  사슴: 'deer',
  여우: 'fox',
  토끼: 'rabbit',
  햄스터: 'hamster',
  호랑이: 'tiger',
  거북: 'turtle',
  거북이: 'turtle',
};

const normalizeGenderKey = (gender: string | null | undefined): GenderKey | null => {
  if (!gender) return null;
  const normalized = gender.trim().toLowerCase();
  if (normalized === 'm' || normalized === 'male' || normalized === 'man' || normalized === '남자') {
    return 'm';
  }
  if (
    normalized === 'w' ||
    normalized === 'f' ||
    normalized === 'female' ||
    normalized === 'woman' ||
    normalized === '여자'
  ) {
    return 'w';
  }
  return null;
};

const normalizeAnimalKey = (animalType: string | null | undefined): AnimalKey | null => {
  if (!animalType) return null;

  const compacted = animalType
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[_-]/g, '')
    .replace(/상$/g, '')
    .replace(/형$/g, '');

  return ANIMAL_ALIAS_TO_KEY[compacted] ?? null;
};

export const resolveProfileAnimalImage = (
  gender: string | null | undefined,
  animalType: string | null | undefined
): StaticImageData | null => {
  const genderKey = normalizeGenderKey(gender);
  const animalKey = normalizeAnimalKey(animalType);
  if (!genderKey || !animalKey) return null;
  return IMAGE_MAP[genderKey][animalKey] ?? null;
};
