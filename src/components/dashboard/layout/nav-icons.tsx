import AreaChartIcon from "@mui/icons-material/AreaChart";
import CategoryIcon from "@mui/icons-material/Category";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import GroupIcon from "@mui/icons-material/Group";
import LocalActivityIcon from "@mui/icons-material/LocalActivity";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import NaturePeopleIcon from "@mui/icons-material/NaturePeople";
import PersonIcon from "@mui/icons-material/Person";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import EditLocationIcon from '@mui/icons-material/EditLocation';

export const navIcons = {
	"chart-pie": AreaChartIcon,
	user: PersonIcon,
	users: GroupIcon,
	emotions: EmojiEmotionsIcon,
	cities: LocationCityIcon,
	categories: CategoryIcon,
	mobileApp: PhoneAndroidIcon,
	attractions: NaturePeopleIcon,
	eventCategories: LocalActivityIcon,
	places: EditLocationIcon,
} as Record<string, any>;
