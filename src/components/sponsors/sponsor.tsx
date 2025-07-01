"use client";

import {
	Carousel,
	type CarouselApi,
	CarouselContent,
	CarouselItem,
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

const BRONZE_PARTNERS: Sponsor[] = [
	{
		id: 3,
		img: "/assets/sponsor/ogoLogo.png",
		altText: "ogo",
	},
	{
		id: 2,
		img: "/assets/sponsor/logo-trans.png",
		altText: "codearch",
	},
];

const BEVERAGE_PARTNERS: Sponsor[] = [
	{
		id: 4,
		img: "/assets/sponsor/sunquick-logo.png",
		altText: "sunquick",
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
	const cardContent = (
		<div className="relative w-full h-full transition-all duration-300 hover:scale-105 group">
			<div className="w-full h-[130px] relative flex items-center justify-center">
				{/* Subtract SVG card background */}
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

				{/* Sponsor logo */}
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

	return cardContent;
};

// Sponsor section component for reusable logic
const SponsorSection = ({
	title,
	sponsors,
	isMobile,
	// currentIndex,
}: {
	title: string;
	sponsors: Sponsor[];
	isMobile: boolean;
	currentIndex?: number;
}) => {
	const hasMultipleSponsors = sponsors.length > 1;
	const [api, setApi] = useState<CarouselApi>();
	const [current, setCurrent] = useState(0);

	// Dynamic title based on current slide for bronze partners
	const getDynamicTitle = () => {
		if (title === "BRONZE PARTNER" && isMobile && hasMultipleSponsors) {
			// ogo is first (index 0), codearch is second (index 1)
			return current === 1 ? "ASSOCIATE PARTNER" : title;
		}
		return title;
	};

	// Update current index when carousel slides
	useEffect(() => {
		if (!api) return;

		const onSelect = () => {
			setCurrent(api.selectedScrollSnap());
		};

		api.on("select", onSelect);
		// Call once to set initial slide
		setCurrent(api.selectedScrollSnap());

		return () => {
			api.off("select", onSelect);
		};
	}, [api]);

	return (
		<div className="mb-8">
			<h3
				className={cn(
					"text-xl md:text-2xl text-center text-[#e957dd]",
					readyplayerone.className,
				)}
			>
				{getDynamicTitle()}
			</h3>
			{isMobile && hasMultipleSponsors ? (
				// Mobile carousel view for multiple sponsors with custom arrows and indicators
				<div className="max-w-md mx-auto">
					<Carousel
						opts={{
							align: "center",
							loop: true,
						}}
						className="w-full relative"
						setApi={setApi}
					>
						<CarouselContent>
							{sponsors.map((sponsor) => (
								<CarouselItem key={`mobile-${sponsor.id}`}>
									<SponsorCard img={sponsor.img} altText={sponsor.altText} />
								</CarouselItem>
							))}
						</CarouselContent>

						{/* Custom Navigation Controls */}
						<div className="flex items-center justify-center mt-4 space-x-4">
							<button
								type="button"
								className="text-[#e957dd] hover:text-[#e957dd]/80 transition-colors p-2"
								onClick={() => api?.scrollPrev()}
								aria-label="Previous sponsor"
							>
								<svg
									width="32"
									height="32"
									className="w-6 h-6 sm:w-8 sm:h-8"
									viewBox="0 0 24 24"
									fill="none"
									role="img"
									aria-labelledby="prev-arrow-mobile"
								>
									<title id="prev-arrow-mobile">Previous</title>
									<path
										d="M15 18l-6-6 6-6"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</button>

							{/* Pagination indicators */}
							<div className="flex space-x-2 items-center justify-center">
								{sponsors.map((sponsor, index) => (
									<button
										type="button"
										key={`mobile-indicator-${sponsor.id}`}
										onClick={() => api?.scrollTo(index)}
										className={`w-8 sm:w-10 lg:w-12 h-[5px] rounded-[5px] transition-all duration-300 ${
											current === index
												? "bg-[#e957dd]"
												: "bg-[#e957dd] opacity-30"
										}`}
										aria-label={`Go to sponsor ${index + 1}`}
									/>
								))}
							</div>

							<button
								type="button"
								className="text-[#e957dd] hover:text-[#e957dd]/80 transition-colors p-2"
								onClick={() => api?.scrollNext()}
								aria-label="Next sponsor"
							>
								<svg
									width="32"
									height="32"
									className="w-6 h-6 sm:w-8 sm:h-8"
									viewBox="0 0 24 24"
									fill="none"
									role="img"
									aria-labelledby="next-arrow-mobile"
								>
									<title id="next-arrow-mobile">Next</title>
									<path
										d="M9 18l6-6-6-6"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</button>
						</div>
					</Carousel>
				</div>
			) : hasMultipleSponsors ? (
				// Desktop carousel view for multiple sponsors with custom arrows and indicators
				<div className="max-w-2xl mx-auto">
					<Carousel
						opts={{
							align: "center",
							loop: true,
						}}
						className="w-full relative"
						setApi={setApi}
					>
						<CarouselContent>
							{sponsors.map((sponsor) => (
								<CarouselItem
									key={`desktop-${sponsor.id}`}
									className="md:basis-1/2"
								>
									<SponsorCard img={sponsor.img} altText={sponsor.altText} />
								</CarouselItem>
							))}
						</CarouselContent>

						{/* Custom Arrow Navigation for Desktop */}
						<button
							type="button"
							onClick={() => api?.scrollPrev()}
							className="absolute left-4 top-1/2 -translate-y-1/2 z-20 text-[#e957dd] hover:text-[#e957dd]/80 transition-colors"
							aria-label="Previous sponsor"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 36"
								fill="none"
								role="img"
								aria-labelledby="prev-arrow-desktop"
							>
								<title id="prev-arrow-desktop">Previous</title>
								<path
									d="M15 5L5 18L15 31"
									stroke="currentColor"
									strokeWidth="4"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						</button>

						<button
							type="button"
							onClick={() => api?.scrollNext()}
							className="absolute right-4 top-1/2 -translate-y-1/2 z-20 text-[#e957dd] hover:text-[#e957dd]/80 transition-colors"
							aria-label="Next sponsor"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 36"
								fill="none"
								role="img"
								aria-labelledby="next-arrow-desktop"
							>
								<title id="next-arrow-desktop">Next</title>
								<path
									d="M9 5L19 18L9 31"
									stroke="currentColor"
									strokeWidth="4"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						</button>

						{/* Pagination indicators for Desktop */}
						<div className="flex justify-center mt-4 gap-2 items-center">
							{sponsors.map((sponsor, index) => (
								<button
									type="button"
									key={`desktop-indicator-${sponsor.id}`}
									onClick={() => api?.scrollTo(index)}
									className={`w-8 sm:w-10 lg:w-12 h-[5px] rounded-[5px] transition-all duration-300 ${
										current === index
											? "bg-[#e957dd]"
											: "bg-[#e957dd] opacity-30"
									}`}
									aria-label={`Go to sponsor ${index + 1}`}
								/>
							))}
						</div>
					</Carousel>
				</div>
			) : (
				// Single sponsor centered view
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

	// Detect mobile view
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

	return (
		<section className="w-full lg:pt-16 px-4">
			<div className="max-w-7xl mx-auto">
				{/* Title Partners */}
				<SponsorSection
					title="TITLE PARTNER"
					sponsors={TITLE_PARTNERS}
					isMobile={isMobile}
				/>

				{/* Bronze Partners - Desktop: Show both side by side, Mobile: Carousel with dynamic title */}
				{isMobile ? (
					<SponsorSection
						title="BRONZE PARTNER"
						sponsors={BRONZE_PARTNERS}
						isMobile={isMobile}
					/>
				) : (
					<div className="mb-8">
						<div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
							{/* First bronze partner (ogo) on desktop */}
							<div className="text-center">
								<h3
									className={cn(
										"text-xl md:text-2xl text-center text-[#e957dd] mb-4",
										readyplayerone.className,
									)}
								>
									BRONZE PARTNERS
								</h3>
								<div className="flex justify-center">
									<div className="w-full max-w-md">
										<SponsorCard
											img={BRONZE_PARTNERS[0].img}
											altText={BRONZE_PARTNERS[0].altText}
										/>
									</div>
								</div>
							</div>
							{/* Second bronze partner (codearch) on desktop */}
							<div className="text-center">
								<h3
									className={cn(
										"text-xl md:text-2xl text-center text-[#e957dd] mb-4",
										readyplayerone.className,
									)}
								>
									ASSOCIATE PARTNER
								</h3>
								<div className="flex justify-center">
									<div className="w-full max-w-md">
										<SponsorCard
											img={BRONZE_PARTNERS[1].img}
											altText={BRONZE_PARTNERS[1].altText}
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
				)}

				{/* Beverage Partners */}
				<SponsorSection
					title="BEVERAGE PARTNER"
					sponsors={BEVERAGE_PARTNERS}
					isMobile={isMobile}
				/>
			</div>
		</section>
	);
}
