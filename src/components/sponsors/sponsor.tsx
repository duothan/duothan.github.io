"use client";

import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import localFont from "next/font/local";
import Image from "next/image";
import { useEffect, useState } from "react";

// Import custom font
const readyplayerone = localFont({
	src: "../../../public/font.otf",
	display: "swap",
});

// Define sponsor types
interface Sponsor {
	id: number;
	img: string;
	altText?: string;
}

// Define sponsor data with direct image paths
const TITLE_PARTNERS: Sponsor[] = [
	{
		id: 1,
		img: "/assets/sponsor/NSBM-LOGO.png",
		altText: "NSBM Green University",
	},
];

const SILVER: Sponsor[] = [
	{
		id: 2,
		img: "/assets/sponsor/irusri.png",
		altText: "codearch",
	},
];

const BRONZE_PARTNERS: Sponsor[] = [
	{
		id: 3,
		img: "/assets/sponsor/ogoLogo.png",
		altText: "codearch",
	},
];
const ASSOCIATE_PARTNER: Sponsor[] = [
	{
		id: 4,
		img: "/assets/sponsor/logo-trans.png",
		altText: "codearch",
	},
];

const BEVERAGE_PARTNERS: Sponsor[] = [
	{
		id: 5,
		img: "/assets/sponsor/sunquick-logo.png",
		altText: "sunquick",
	},
	{
		id: 6,
		img: "/assets/sponsor/elephantHouse.png",
		altText: "elephantHouse",
	},
];

// Sponsor card component
const SponsorCard = ({
	img,
	altText = "Sponsor logo",
}: {
	img: string;
	url?: string;
	altText?: string;
}) => {
	return (
		<div className="relative w-full h-full transition-all duration-300 hover:scale-105 group">
			<div className="w-full h-[130px] relative flex items-center justify-center">
				<div className="absolute inset-0 flex items-center justify-center">
					<Image
						src="/assets/sponsor/Subtract.svg"
						alt="Card background"
						width={200}
						height={160}
						className="object-contain"
						priority
					/>
				</div>
				<div
					className={`relative z-10 ${altText === "codearch" ? "bg-[#1a1a1a]" : "bg-white"} flex items-center justify-center w-[125px] h-[60px]`}
				>
					<Image
						src={img}
						alt={altText || "Sponsor logo"}
						width={120}
						height={50}
						className="object-contain max-w-full p-1 max-h-full"
					/>
				</div>
			</div>
		</div>
	);
};

// Sponsor section component
const SponsorSection = ({
	title,
	sponsors,
	isMobile,
}: {
	title: string;
	sponsors: Sponsor[];
	isMobile: boolean;
}) => {
	const hasMultipleSponsors = sponsors.length > 1;

	return (
		<div className="mb-8">
			<h3
				className={cn(
					"text-xl md:text-2xl text-center text-[#e957dd]",
					readyplayerone.className,
				)}
			>
				{title}
			</h3>
			{isMobile && hasMultipleSponsors ? (
				<div className="max-w-md mx-auto">
					<Carousel
						opts={{
							align: "center",
							loop: true,
						}}
						className="w-full"
					>
						<CarouselContent>
							{sponsors.map((sponsor) => (
								<CarouselItem key={`mobile-${sponsor.id}`}>
									<SponsorCard img={sponsor.img} altText={sponsor.altText} />
								</CarouselItem>
							))}
						</CarouselContent>
						<CarouselPrevious className="left-2 bg-[#e957dd] hover:bg-[#e957dd]/80 border-[#e957dd] text-white" />
						<CarouselNext className="right-2 bg-[#e957dd] hover:bg-[#e957dd]/80 border-[#e957dd] text-white" />
					</Carousel>
				</div>
			) : hasMultipleSponsors ? (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 lg:gap-6 max-w-2xl mx-auto">
					{sponsors.map((sponsor) => (
						<div key={`desktop-${sponsor.id}`}>
							<SponsorCard img={sponsor.img} altText={sponsor.altText} />
						</div>
					))}
				</div>
			) : (
				<div className="flex justify-center">
					{sponsors.map((sponsor) => (
						<div key={`single-${sponsor.id}`} className="w-full max-w-md">
							<SponsorCard img={sponsor.img} altText={sponsor.altText} />
						</div>
					))}
				</div>
			)}
		</div>
	);
};

// Main component
export default function Sponsor() {
	const [isMobile, setIsMobile] = useState(false);
	const [activeCarouselIndex, setActiveCarouselIndex] = useState(0);
	const combinedSponsors = [
		...SILVER,
		...BRONZE_PARTNERS,
		...ASSOCIATE_PARTNER,
	];

	useEffect(() => {
		const checkIsMobile = () => {
			setIsMobile(window.innerWidth < 768);
		};

		checkIsMobile();
		window.addEventListener("resize", checkIsMobile);

		return () => {
			window.removeEventListener("resize", checkIsMobile);
		};
	}, []);

	const getCurrentSponsorTitle = () => {
		const currentIndex = activeCarouselIndex % combinedSponsors.length;

		if (currentIndex < SILVER.length) return "SILVER PARTNER";
		if (currentIndex < SILVER.length + BRONZE_PARTNERS.length)
			return "BRONZE PARTNER";
		return "ASSOCIATE PARTNER";
	};

	return (
		<section className="w-full lg:pt-16 px-4">
			<div className="max-w-7xl mx-auto">
				<SponsorSection
					title="TITLE PARTNER"
					sponsors={TITLE_PARTNERS}
					isMobile={isMobile}
				/>

				{isMobile ? (
					<div className="mb-8">
						<h3
							className={cn(
								"text-xl md:text-2xl text-center text-[#e957dd]",
								readyplayerone.className,
							)}
						>
							{getCurrentSponsorTitle()}
						</h3>
						<div className="max-w-md mx-auto">
							<Carousel
								opts={{ align: "center", loop: true }}
								className="w-full"
								setApi={(api) => {
									if (api) {
										api.on("select", () =>
											setActiveCarouselIndex(api.selectedScrollSnap()),
										);
										setActiveCarouselIndex(api.selectedScrollSnap());
									}
								}}
							>
								<CarouselContent>
									{combinedSponsors.map((sponsor) => (
										<CarouselItem key={`combined-mobile-${sponsor.id}`}>
											<SponsorCard
												img={sponsor.img}
												altText={sponsor.altText}
											/>
										</CarouselItem>
									))}
								</CarouselContent>
								<CarouselPrevious className="left-2 bg-[#e957dd] hover:bg-[#e957dd]/80 border-[#e957dd] text-white" />
								<CarouselNext className="right-2 bg-[#e957dd] hover:bg-[#e957dd]/80 border-[#e957dd] text-white" />
							</Carousel>
						</div>
					</div>
				) : (
					<div className="flex flex-row items-start justify-center gap-7 mb-8 flex-wrap">
						<SponsorSection
							title="SILVER PARTNER"
							sponsors={SILVER}
							isMobile={isMobile}
						/>
						<SponsorSection
							title="BRONZE PARTNER"
							sponsors={BRONZE_PARTNERS}
							isMobile={isMobile}
						/>
						<SponsorSection
							title="ASSOCIATE PARTNER"
							sponsors={ASSOCIATE_PARTNER}
							isMobile={isMobile}
						/>
					</div>
				)}

				<SponsorSection
					title="BEVERAGE PARTNER"
					sponsors={BEVERAGE_PARTNERS}
					isMobile={isMobile}
				/>
			</div>
		</section>
	);
}
