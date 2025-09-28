import type { NavItemConfig } from "@/types/nav";
import { paths } from "@/paths";

export const navItems = [
	{ key: "overview", title: "Overview", href: paths.dashboard.overview, icon: "chart-pie" },
	{ key: "users", title: "Users", href: paths.dashboard.users, icon: "users" },
	{ key: "emotions", title: "Emotions", href: paths.dashboard.emotions, icon: "emotions" },
	{ key: "cities", title: "Cities", href: paths.dashboard.cities, icon: "cities" },
	{ key: "categories", title: "Categories", href: paths.dashboard.categories, icon: "categories" },
	{ key: "attractions", title: "Attractions", href: paths.dashboard.attractions, icon: "attractions" },
	{
		key: "event-categories",
		title: "Event Categories",
		href: paths.dashboard.eventCategories,
		icon: "eventCategories",
	},
	{ key: "mobile-app", title: "Mobile App", href: paths.dashboard.mobileApp, icon: "mobileApp" },
	// { key: "settings", title: "Settings", href: paths.dashboard.settings, icon: "gear-six" },
	// { key: "account", title: "Account", href: paths.dashboard.account, icon: "user" },
	// { key: "error", title: "Error", href: paths.errors.notFound, icon: "x-square" },
] satisfies NavItemConfig[];
