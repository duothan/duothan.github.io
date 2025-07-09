"use client";

import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import type { CarouselApi } from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import Autoplay from "embla-carousel-autoplay";
import localFont from "next/font/local";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

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

const SILVER_PARTNERS: Sponsor[] = [
	{
		id: 2,
		img: "/assets/sponsor/IsuriGroup.png",
		altText: "IsuriGroup",
	},
];

const BRONZE_PARTNERS: Sponsor[] = [
	{
		id: 3,
		img: "/assets/sponsor/ogoLogo.png",
		altText: "ogo",
	},
];

const ASSOCIATE_PARTNERS: Sponsor[] = [
	{
		id: 4,
		img: "/assets/sponsor/logo-trans.png",
		altText: "codearch",
	},
];

const MEDIA_PARTNERS: Sponsor[] = [
	{
		id: 5,
		img: "/assets/sponsor/derana_aruna.png",
		altText: "Derana Aruna",
	},
];

const KNOWLEDGE_PARTNERS: Sponsor[] = [
	{
		id: 6,
		img: "/assets/sponsor/ifs.png",
		altText: "IFS",
	},
];

const BEVERAGE_PARTNERS: Sponsor[] = [
	{
		id: 7,
		img: "/assets/sponsor/sunquick-logo.png",
		altText: "sunquick",
	},
	{
		id: 8,
		img: "./assets/sponsor/elephantHouse.png",
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
				// Mobile carousel view for multiple sponsors
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
				// Desktop grid view for multiple sponsors
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 lg:gap-6 max-w-2xl mx-auto">
					{sponsors.map((sponsor) => (
						<div key={`desktop-${sponsor.id}`}>
							<SponsorCard img={sponsor.img} altText={sponsor.altText} />
						</div>
					))}
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
	const [currentIndex, setCurrentIndex] = useState(0);
	const [thirdRowCurrentIndex, setThirdRowCurrentIndex] = useState(0);
	const [api, setApi] = useState<CarouselApi | null>(null);
	const [thirdRowApi, setThirdRowApi] = useState<CarouselApi | null>(null);

	// Combined sponsor categories for mobile carousel with titles
	const sponsorCategories = useMemo(
		() => [
			{ title: "SILVER PARTNER", sponsors: SILVER_PARTNERS },
			{ title: "BRONZE PARTNERS", sponsors: BRONZE_PARTNERS },
			{ title: "ASSOCIATE PARTNER", sponsors: ASSOCIATE_PARTNERS },
		],
		[],
	);

	// Combined sponsors for the third row (media, knowledge, and beverage partners)
	const thirdRowCategories = useMemo(
		() => [
			{ title: "MEDIA PARTNER", sponsors: MEDIA_PARTNERS },
			{ title: "KNOWLEDGE PARTNER", sponsors: KNOWLEDGE_PARTNERS },
			{ title: "BEVERAGE PARTNER", sponsors: BEVERAGE_PARTNERS },
		],
		[],
	);

	// Calculate category indices for easier lookup
	const categoryIndices = useMemo(
		() =>
			sponsorCategories.reduce(
				(acc, _, i) => {
					const previousTotal = i > 0 ? acc[i - 1].end : 0;
					const categoryLength = sponsorCategories[i].sponsors.length;
					acc.push({
						start: previousTotal,
						end: previousTotal + categoryLength,
					});
					return acc;
				},
				[] as Array<{ start: number; end: number }>,
			),
		[sponsorCategories],
	);

	// Calculate third row category indices
	const thirdRowCategoryIndices = useMemo(
		() =>
			thirdRowCategories.reduce(
				(acc, _, i) => {
					const previousTotal = i > 0 ? acc[i - 1].end : 0;
					const categoryLength = thirdRowCategories[i].sponsors.length;
					acc.push({
						start: previousTotal,
						end: previousTotal + categoryLength,
					});
					return acc;
				},
				[] as Array<{ start: number; end: number }>,
			),
		[thirdRowCategories],
	);

	// Handle slide changes for main carousel
	useEffect(() => {
		if (!api) return;

		const onSelect = () => {
			const selectedIndex = api.selectedScrollSnap();
			const totalSponsors = sponsorCategories.flatMap(
				(cat) => cat.sponsors,
			).length;
			const adjustedIndex =
				((selectedIndex % totalSponsors) + totalSponsors) % totalSponsors;

			// Find which category this index falls into
			for (let i = 0; i < categoryIndices.length; i++) {
				if (
					adjustedIndex >= categoryIndices[i].start &&
					adjustedIndex < categoryIndices[i].end
				) {
					setCurrentIndex(i);
					break;
				}
			}
		};

		// Set initial slide
		onSelect();

		// Listen for slide changes
		api.on("select", onSelect);

		return () => {
			api.off("select", onSelect);
		};
	}, [api, categoryIndices, sponsorCategories]);

	// Handle slide changes for third row carousel
	useEffect(() => {
		if (!thirdRowApi) return;

		const onSelect = () => {
			const selectedIndex = thirdRowApi.selectedScrollSnap();
			const totalSponsors = thirdRowCategories.flatMap(
				(cat) => cat.sponsors,
			).length;
			const adjustedIndex =
				((selectedIndex % totalSponsors) + totalSponsors) % totalSponsors;

			// Find which category this index falls into
			for (let i = 0; i < thirdRowCategoryIndices.length; i++) {
				if (
					adjustedIndex >= thirdRowCategoryIndices[i].start &&
					adjustedIndex < thirdRowCategoryIndices[i].end
				) {
					setThirdRowCurrentIndex(i);
					break;
				}
			}
		};

		// Set initial slide
		onSelect();

		// Listen for slide changes
		thirdRowApi.on("select", onSelect);

		return () => {
			thirdRowApi.off("select", onSelect);
		};
	}, [thirdRowApi, thirdRowCategoryIndices, thirdRowCategories]);

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

				{isMobile ? (
					// Mobile view - Single carousel with changing titles
					<div className="mb-8">
						<h3
							className={cn(
								"text-xl md:text-2xl text-center text-[#e957dd] transition-all duration-300",
								readyplayerone.className,
							)}
						>
							{sponsorCategories[currentIndex].title}
						</h3>
						<div className="max-w-md mx-auto">
							<Carousel
								opts={{
									align: "center",
									loop: true,
									skipSnaps: false,
									dragFree: false,
								}}
								plugins={[
									Autoplay({
										delay: 3000,
										stopOnMouseEnter: true,
										stopOnInteraction: false,
									}),
								]}
								className="w-full"
								setApi={setApi}
							>
								<CarouselContent>
									{sponsorCategories.flatMap((category, catIdx) => {
										// Calculate absolute indices for sponsors in this category
										let categoryStartIndex = 0;
										for (let i = 0; i < catIdx; i++) {
											categoryStartIndex +=
												sponsorCategories[i].sponsors.length;
										}

										return category.sponsors.map((sponsor, sponsorIdx) => {
											const absoluteIndex = categoryStartIndex + sponsorIdx;
											return (
												<CarouselItem
													key={`mobile-cat-${catIdx}-sponsor-${sponsor.id}`}
													// Add data attributes to help with debugging
													data-category={category.title}
													data-index={absoluteIndex}
												>
													<SponsorCard
														img={sponsor.img}
														altText={sponsor.altText}
													/>
												</CarouselItem>
											);
										});
									})}
								</CarouselContent>
								<CarouselPrevious className="left-2 bg-[#e957dd] hover:bg-[#e957dd]/80 border-[#e957dd] text-white" />
								<CarouselNext className="right-2 bg-[#e957dd] hover:bg-[#e957dd]/80 border-[#e957dd] text-white" />
							</Carousel>

							{/* Carousel indicators */}
							<div className="flex justify-center mt-4 gap-2 md:gap-4 items-center">
								{sponsorCategories.map((category, index) => (
									<button
										type="button"
										key={`indicator-${category.title}`}
										onClick={() => api?.scrollTo(categoryIndices[index].start)}
										className={`w-8 sm:w-10 lg:w-12 h-[5px] rounded-[5px] transition-all duration-300 ${
											currentIndex === index
												? "bg-[#e957dd]"
												: "bg-[#e957dd] opacity-30"
										}`}
										aria-label={`Go to ${category.title}`}
									/>
								))}
							</div>
						</div>
					</div>
				) : (
					// Desktop view - Side by side sections in a row
					<div className="grid grid-cols-3 gap-4 mb-8">
						{/* Silver Partner - Left */}
						<div>
							<h3
								className={cn(
									"text-xl md:text-2xl text-center text-[#e957dd]",
									readyplayerone.className,
								)}
							>
								SILVER PARTNER
							</h3>
							<div className="flex justify-center">
								{SILVER_PARTNERS.map((sponsor) => (
									<div key={`silver-${sponsor.id}`} className="w-full max-w-md">
										<SponsorCard img={sponsor.img} altText={sponsor.altText} />
									</div>
								))}
							</div>
						</div>

						{/* Bronze Partners - Middle */}
						<div>
							<h3
								className={cn(
									"text-xl md:text-2xl text-center text-[#e957dd]",
									readyplayerone.className,
								)}
							>
								BRONZE PARTNERS
							</h3>
							<div className="flex justify-center">
								{BRONZE_PARTNERS.map((sponsor) => (
									<div key={`bronze-${sponsor.id}`} className="w-full max-w-md">
										<SponsorCard img={sponsor.img} altText={sponsor.altText} />
									</div>
								))}
							</div>
						</div>

						{/* Associate Partner - Right */}
						<div>
							<h3
								className={cn(
									"text-xl md:text-2xl text-center text-[#e957dd]",
									readyplayerone.className,
								)}
							>
								ASSOCIATE PARTNER
							</h3>
							<div className="flex justify-center">
								{ASSOCIATE_PARTNERS.map((sponsor) => (
									<div
										key={`associate-${sponsor.id}`}
										className="w-full max-w-md"
									>
										<SponsorCard img={sponsor.img} altText={sponsor.altText} />
									</div>
								))}
							</div>
						</div>
					</div>
				)}

				{/* Third row partners - Media & Knowledge */}
				{isMobile ? (
					// Mobile view - Carousel with changing titles similar to second row
					<div className="mb-8">
						<h3
							className={cn(
								"text-xl md:text-2xl text-center text-[#e957dd] transition-all duration-300",
								readyplayerone.className,
							)}
						>
							{thirdRowCategories[thirdRowCurrentIndex].title}
						</h3>
						<div className="max-w-md mx-auto">
							<Carousel
								opts={{
									align: "center",
									loop: true,
									skipSnaps: false,
									dragFree: false,
								}}
								plugins={[
									Autoplay({
										delay: 3000,
										stopOnMouseEnter: true,
										stopOnInteraction: false,
									}),
								]}
								className="w-full"
								setApi={setThirdRowApi}
							>
								<CarouselContent>
									{thirdRowCategories.flatMap((category, catIdx) => {
										// Calculate absolute indices for sponsors in this category
										let categoryStartIndex = 0;
										for (let i = 0; i < catIdx; i++) {
											categoryStartIndex +=
												thirdRowCategories[i].sponsors.length;
										}

										return category.sponsors.map((sponsor, sponsorIdx) => {
											const absoluteIndex = categoryStartIndex + sponsorIdx;
											return (
												<CarouselItem
													key={`mobile-third-row-${catIdx}-sponsor-${sponsor.id}`}
													data-category={category.title}
													data-index={absoluteIndex}
												>
													<SponsorCard
														img={sponsor.img}
														altText={sponsor.altText}
													/>
												</CarouselItem>
											);
										});
									})}
								</CarouselContent>
								<CarouselPrevious className="left-2 bg-[#e957dd] hover:bg-[#e957dd]/80 border-[#e957dd] text-white" />
								<CarouselNext className="right-2 bg-[#e957dd] hover:bg-[#e957dd]/80 border-[#e957dd] text-white" />
							</Carousel>

							{/* Carousel indicators */}
							<div className="flex justify-center mt-4 gap-2 md:gap-4 items-center">
								{thirdRowCategories.map((category, index) => (
									<button
										type="button"
										key={`indicator-third-row-${category.title}`}
										onClick={() =>
											thirdRowApi?.scrollTo(
												thirdRowCategoryIndices[index].start,
											)
										}
										className={`w-8 sm:w-10 lg:w-12 h-[5px] rounded-[5px] transition-all duration-300 ${
											thirdRowCurrentIndex === index
												? "bg-[#e957dd]"
												: "bg-[#e957dd] opacity-30"
										}`}
										aria-label={`Go to ${category.title}`}
									/>
								))}
							</div>
						</div>
					</div>
				) : (
					// Desktop view - All three categories in one row
					<div className="grid grid-cols-3 gap-4 mb-8">
						{/* Media Partner */}
						<div>
							<h3
								className={cn(
									"text-xl md:text-2xl text-center text-[#e957dd]",
									readyplayerone.className,
								)}
							>
								MEDIA PARTNER
							</h3>
							<div className="flex justify-center">
								{MEDIA_PARTNERS.map((sponsor) => (
									<div key={`media-${sponsor.id}`} className="w-full max-w-md">
										<SponsorCard img={sponsor.img} altText={sponsor.altText} />
									</div>
								))}
							</div>
						</div>

						{/* Knowledge Partner */}
						<div>
							<h3
								className={cn(
									"text-xl md:text-2xl text-center text-[#e957dd]",
									readyplayerone.className,
								)}
							>
								KNOWLEDGE PARTNER
							</h3>
							<div className="flex justify-center">
								{KNOWLEDGE_PARTNERS.map((sponsor) => (
									<div
										key={`knowledge-${sponsor.id}`}
										className="w-full max-w-md"
									>
										<SponsorCard img={sponsor.img} altText={sponsor.altText} />
									</div>
								))}
							</div>
						</div>

						{/* Beverage Partners - with carousel */}
						<div>
							<h3
								className={cn(
									"text-xl md:text-2xl text-center text-[#e957dd]",
									readyplayerone.className,
								)}
							>
								BEVERAGE PARTNER
							</h3>
							<div className="max-w-md mx-auto">
								<Carousel
									opts={{
										align: "center",
										loop: true,
									}}
									plugins={[
										Autoplay({
											delay: 3000,
											stopOnMouseEnter: true,
											stopOnInteraction: false,
										}),
									]}
									className="w-full"
								>
									<CarouselContent>
										{BEVERAGE_PARTNERS.map((sponsor) => (
											<CarouselItem key={`beverage-${sponsor.id}`}>
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
					</div>
				)}
			</div>
		</section>
	);
}
