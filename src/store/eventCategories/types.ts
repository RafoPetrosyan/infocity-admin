import { Translation } from "@/types/translations";

export interface Emotion {
	id: string;
	color: string;
	icon: string;
	translations: Translation[];
}

export interface EmotionsResponse {
	data: Emotion[];
	count: number;
}
