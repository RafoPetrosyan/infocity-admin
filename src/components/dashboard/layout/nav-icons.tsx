import CategoryIcon from "@mui/icons-material/Category";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import { ChartPieIcon } from "@phosphor-icons/react/dist/ssr/ChartPie";
import { GearSixIcon } from "@phosphor-icons/react/dist/ssr/GearSix";
import { PlugsConnectedIcon } from "@phosphor-icons/react/dist/ssr/PlugsConnected";
import { UserIcon } from "@phosphor-icons/react/dist/ssr/User";
import { UsersIcon } from "@phosphor-icons/react/dist/ssr/Users";
import { XSquare } from "@phosphor-icons/react/dist/ssr/XSquare";

export const navIcons = {
	"chart-pie": ChartPieIcon,
	"gear-six": GearSixIcon,
	"plugs-connected": PlugsConnectedIcon,
	"x-square": XSquare,
	user: UserIcon,
	users: UsersIcon,
	emotions: EmojiEmotionsIcon,
	cities: LocationCityIcon,
	categories: CategoryIcon,
	mobileApp: PhoneAndroidIcon,
} as Record<string, any>;
