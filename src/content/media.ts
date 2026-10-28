import lily from "@/assets/work/fine-line-lily-ribs.jpg";
import realism from "@/assets/work/black-grey-realism-sleeve.jpg";
import lantern from "@/assets/work/black-red-lantern.jpg";
import lettering from "@/assets/work/calligraphy-lettering-forearm.jpg";
import moth from "@/assets/work/black-red-moth.jpg";
import portrait from "@/assets/work/blackwork-portrait-arm.jpg";
import floral from "@/assets/work/floral-dotwork-back.jpg";
import cross from "@/assets/work/black-grey-cross-forearm.jpg";

import interior from "@/assets/studio/studio-interior.jpg";
import workspace from "@/assets/studio/workspace.jpg";
import lounge from "@/assets/studio/lounge.jpg";
import chandelier from "@/assets/studio/chandelier.jpg";
import details from "@/assets/studio/details.jpg";

import statue from "@/assets/brand/statue.jpg";

/** Portfolio order also defines the column layout in the Work section. */
export const workImages = { lily, realism, lantern, lettering, moth, portrait, floral, cross } as const;
export type WorkKey = keyof typeof workImages;
export const workOrder: WorkKey[] = ["lily", "realism", "lantern", "lettering", "moth", "portrait", "floral", "cross"];

export const studioImages = { interior, workspace, lounge, chandelier, details } as const;
export type StudioKey = keyof typeof studioImages;
export const studioOrder: StudioKey[] = ["interior", "workspace", "lounge", "chandelier", "details"];

export const brandImages = { statue } as const;
