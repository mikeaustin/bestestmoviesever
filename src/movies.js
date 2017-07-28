import Immutable from "immutable";


const movies = Immutable.List([
  { title: "Close Encounters of the Third Kind", released: 1977, directors: [5], categories: [0, 1] },
  { title: "Gangs of New York", released: 2002, directors: [10], categories: [1, 3] },
  { title: "Prince of Darkness", released: 1987, directors: [41], categories: [5, 8] },
  { title: "The Blues Brothers", released: 1980, directors: [84], categories: [4, 2, 3] },
  { title: "21 Grams", released: 2003, directors: [128], categories: [0, 2] },
  { title: "Idiocracy", released: 2006, directors: [40], categories: [0, 2] },
  { title: "Escape from New York", released: 1981, directors: [41], categories: [0, 4] },
  { title: "Clerks", released: 1994, directors: [21], categories: [2] },
  { title: "Death Race", released: 2008, directors: [31], categories: [0, 4, 5] },
  { title: "Spies Like Us", released: 1985, directors: [84], categories: [2, 6] },
  { title: "¡Three Amigos!", released: 1986, image: "Three_Amigos.jpg", directors: [84], categories: [2, 7] },
  { title: "Alien", released: 1979, directors: [0], categories: [0, 8] },
  { title: "A.I. Artificial Intelligence", released: 2001, directors: [5], categories: [0, 1, 6] },
  { title: "Catch Me If You Can", released: 2002, directors: [5], categories: [3, 1] },
  { title: "Minority Report", released: 2002, directors: [5], categories: [4, 6, 3] },
  { title: "Teenage Mutant Ninja Turtles", released: 1990, directors: [38], categories: [4, 6, 2] },
  { title: "Electric Dreams", released: 1984, directors: [38], categories: [2, 1, 9] },
  { title: "Zero Dark Thirty", released: 2012, directors: [12] },
  { title: "The Cable Guy", released: 1996, directors: [27] },
  { title: "O Brother Where Art Thou?", image: "O_Brother_Where_Art_Thou.jpg", released: 2000, directors: [3] },
  { title: "El Mariachi", released: 1992, directors: [8] },
  { title: "Kick-Ass", released: 2010, directors: [17] },
  { title: "Twister", released: 1996, directors: [42] },
  { title: "The Breakfast Club", released: 1985, directors: [22] },
  { title: "50 First Dates", released: 2004, directors: [43] },
  { title: "Tommy Boy", released: 1995, directors: [43] },
  { title: "Billy Madison", released: 1995, directors: [44] },
  { title: "12 Monkeys", released: 1995, directors: [2] },
  { title: "Toy Story", released: 1995, directors: [45] },
  { title: "Lawnmower Man", released: 1992, directors: [46] },
  { title: "Encino Man", released: 1992, directors: [47] },
  { title: "White Men Can't Jump", released: 1992, directors: [11] },
  { title: "The Addams Family", released: 1991, directors: [48] },
  { title: "Delicatessen", released: 1991, directors: [49, 50] },
  { title: "Point Break", released: 1991, directors: [12] },
  { title: "Terminator: 2 Judgment Day", image: "Terminator_2_Judgment_Day.jpg", released: 1991, directors: [1] },
  { title: "Bill & Ted's Excellent Adventure", released: 1989, directors: [51] },
  { title: "The Fly", released: 1986, directors: [52] },
  { title: "Videodrome", released: 1983, directors: [52] },
  { title: "They Live", released: 1988, directors: [41] },
  { title: "Fargo", released: 1996, directors: [3] },
  { title: "Pet Sematary", released: 1989, directors: [37] },
  { title: "Team America: World Police", image: "Team_America_World_Police.jpg", released: 2004, directors: [53] },
  { title: "Flatliners", released: 1990, directors: [54] },
  { title: "The Lego Movie", released: 2014, directors: [55, 56] },
  { title: "21 Jump Street", released: 2012, directors: [55, 56] },
  { title: "Cloudy with a Chance of Meatballs", released: 2009, directors: [55, 56] },
  { title: "This is Spinal Tap", released: 1984, directors: [30] },
  { title: "UHF", released: 1989, directors: [57] },
  { title: "The 40 Year-Old Virgin", released: 2005, directors: [59] },
  { title: "Kill Bill Volume 1", released: 2003, directors: [7] },
  { title: "Run Lola Run", released: 1998, directors: [58] },
  { title: "La Femme Nikita", released: 1990, directors: [23] },
  { title: "The Boondock Saints", released: 1999, directors: [60] },
  { title: "Killing Zoe", released: 1994, directors: [13] },
  { title: "Accepted", released: 2006, directors: [61] },
  { title: "Hanna", released: 2011, directors: [62] },
  { title: "Sphere", released: 1998, directors: [63] },
  { title: "National Lampoon's Vacation", released: 1983, directors: [64] },
  { title: "National Lampoon's Van Wilder", released: 2002, directors: [65] },
  { title: "American Pie", released: 1999, directors: [66] },
  { title: "My Cousin Vinny", released: 1992, directors: [67] },
  { title: "Robin Hood: Men in Tights", image: "Robin_Hood_Men_in_Tights.jps", released: 1993, directors: [68] },
  { title: "Scarface", released: 1983, directors: [14] },
  { title: "Good Will Hunting", released: 1997, directors: [69] },
  { title: "Bruce Almighty", released: 2003, directors: [29] },
  { title: "Real Genius", released: 1985, directors: [70] },
  { title: "Misery", released: 1990, directors: [30] },
  { title: "Rad", released: 1986, directors: [71] },
  { title: "Dumb and Dumber", released: 1994, directors: [72] },
  { title: "Seven", released: 1995, directors: [6] },
  { title: "Blade Runner", released: 1982, category: 1, directors: [0] },
  { title: "The Terminator", released: 1984, directors: [1] },
  { title: "The Life Aquatic with Steve Zissou", released: 2004, directors: [92] },
  { title: "Tigerland", released: 2000, directors: [54] },
  { title: "The Lost Boys", released: 1987, directors: [54] },
  { title: "How to Train Your Dragon", released: 2010, directors: [97, 98] },
  { title: "Mad Max", released: 1980, directors: [16] },
  { title: "Short Circuit", released: 1986, directors: [15] },
  { title: "Mrs Doubtfire", released: 1993, directors: [92] },
  { title: "The Manhattan Project", released: 1986, directors: [99] },
  { title: "Airplane!", released: 1980 },
  { title: "RoboCop", released: 1987, directors: [36] },
  { title: "E.T. the Extra Terrestrial", released: 1982, directors: [5] },
  { title: "The Cell", released: 2000, directors: [108] },
  { title: "The Waterboy", released: 1998, directors: [100] },
  { title: "WarGames", released: 1983, directors: [15] },
  { title: "Star Wars", released: 1977, directors: [18] },
  { title: "Beverly Hills Cop", released: 1984, directors: [109] },
  { title: "AKIRA", released: 1988, directors: [111] },
  { title: "The Deer Hunter", released: 1978, directors: [19] },
  { title: "Police Academy", released: 1984, directors: [114] },
  { title: "Forbidden Planet", released: 1956, directors: [116] },
  { title: "Layer Cake", released: 2004, directors: [17] },
  { title: "Crank", released: 2006, directors: [95, 96] },
  { title: "The Transporter", released: 2002, directors: [24, 25] },
  { title: "The Return of the Living Dead", released: 1985, directors: [101] },
  { title: "The Toxic Avenger", released: 1986, directors: [102, 103] },
  { title: "Young Frankenstein", released: 1974, directors: [68] },
  { title: "2001: A Space Odyssey", image: "2001_A_Space_Odyssey.jpg", released: 1968, directors: [35] },
  { title: "Dr. Strangelove", released: 1964, directors: [35] },
  { title: "The Day the Earth Stood Still", released: 1951, directors: [127] },
  { title: "The War of the Worlds", released: 1953, directors: [124] },
  { title: "Spaceballs", released: 1987, directors: [68] },
  { title: "Pitch Black", released: 2000, directors: [93] },
  { title: "Maximum Overdrive", released: 1986, directors: [20] },
  { title: "Deuce Bigalow: Male Gigolo", image: "Deuce_Bigalow_Male_Gigolo.jpg", released: 1999, directors: [126] },
  { title: "Reservoir Dogs", released: 1992, directors: [7] },
  { title: "Taps", released: 1981, directors: [94] },
  { title: "Night of the Comet", released: 1984, directors: [117] },
  { title: "Star Wars: The Empire Strikes Back", image: "Star_Wars_The_Empire_Strikes_Back.jpg", released: 1980, directors: [18] },
  { title: "Fear and Loathing in Las Vegas", released: 1998, directors: [2] },
  { title: "Mallrats", released: 1995, directors: [21] },
  { title: "The NeverEnding Story", released: 1984, directors: [123] },
  { title: "Time Bandits", released: 1981, directors: [2] },
  { title: "The Princess Bride", released: 1987, directors: [30] },
  { title: "Gremlins", released: 1984, directors: [92] },
  { title: "Pulp Fiction", released: 1994, directors: [7] },
  { title: "Ferris Bueller's Day Off", released: 1986, directors: [22] },
  { title: "Fight Club", released: 1999, directors: [6] },
  { title: "Revenge of the Nerds", released: 1984, directors: [118] },
  { title: "Weird Science", released: 1985, directors: [22] },
  { title: "The Goonies", released: 1985, directors: [92] },
  { title: "Tron", released: 1982, directors: [26] },
  { title: "Tropic Thunder", released: 2008, directors: [27] },
  { title: "Wonder Woman", released: 2017, directors: [112] },
  { title: "Logan", released: 2017, directors: [105] },
  { title: "The Fifth Element", released: 1997, directors: [23] },
  { title: "The Truman Show", released: 1998, directors: [104] },
  { title: "Hellboy", released: 2004, directors: [106] },
  { title: "WALL-E", released: 2008, directors: [107] },
  { title: "Edge of Tomorrow", released: 2014, directors: [28] },
  { title: "Ace Ventura: Pet Detective", image: "Ace_Ventura_Pet_Detective.jpg", released: 1994, directors: [29] },
  { title: "The Thing", released: 1982, directors: [41] },
  { title: "The Matrix", released: 1999, directors: [3, 4] },
  { title: "Back to School", released: 1986, directors: [115] },
  { title: "Reanimator", released: 1985, directors: [80] },
  { title: "Edward Scissorhands", released: 1990, directors: [79] },
  { title: "Uncle Buck", released: 1989, directors: [22] },
  { title: "Super Troopers", released: 2002, directors: [81] },
  { title: "Beerfest", released: 2006, directors: [81] },
  { title: "Clash of the Titans", released: 1981, directors: [82] },
  { title: "Clockwork Orange", released: 1972, directors: [35] },
  { title: "Big Trouble in Little China", released: 1986, directors: [41] },
  { title: "Ghostbusters", released: 1984, directors: [83] },
  { title: "One Flew Over the Cuckoo's Nest", released: 1975, directors: [121] },
  { title: "Taxi Driver", released: 1976, directors: [10] },
  { title: "The Shining", released: 1980, directors: [35] },
  { title: "Rambo First Blood", released: 1982, directors: [110] },
  { title: "Red Dawn", released: 1984, directors: [113] },
  { title: "Rain Man", released: 1988, directors: [63] },
  { title: "The Naked Gun", released: 1988, directors: [119] },
  { title: "Flight of the Navigator", released: 1986, directors: [125] },
  { title: "Balls of Fury", released: 2007, directors: [120] },
  { title: "Raising Arizona", released: 1987, directors: [3] },
  { title: "An American Werewolf in London", released: 1981, directors: [84] },
  { title: "Beetlejuice", released: 1988, directors: [79] },
  { title: "American Beauty", released: 1999, directors: [85] },
  { title: "Snatch", released: 2001, directors: [17] },
  { title: "Memento", released: 2000, directors: [9] },
  { title: "Donnie Darko", released: 2001, directors: [86] },
  { title: "Lost in Translation", released: 2003, directors: [87] },
  { title: "Zombieland", released: 2009, directors: [88] },
  { title: "Napoleon Dynamite", released: 2004, directors: [89] },
  { title: "Being John Malkovich", released: 1999, directors: [73] },
  { title: "Her", released: 2013, directors: [73] },
  { title: "There's Something About Mary", released: 1998, directors: [72] },
  { title: "Men in Black", released: 1997, directors: [48] },
  { title: "Groundhog Day", released: 1993, directors: [64] },
  { title: "Wayne's World", released: 1992, directors: [74] },
  { title: "Army of Darkness", released: 1993, directors: [32] },
  { title: "Jurassic Park", released: 1993, directors: [5] },
  { title: "Leon The Professional", released: 1994, directors: [23] },
  { title: "Ronin", released: 1998, directors: [75] },
  { title: "Austin Powers International Man of Mystery", released: 1997, directors: [122] },
  { title: "Gladiator", released: 2000, directors: [0] },
  { title: "Black Hawk Down", released: 2001, directors: [0] },
  { title: "Back to the Future", released: 1985, directors: [76] },
  { title: "Batman Begins", released: 2005, directors: [9] },
  { title: "300", released: 2006, directors: [77] },
  { title: "No Country for Old Men", released: 2007, directors: [3, 4] },
  { title: "From Dusk Till Dawn", released: 1996, directors: [8] },
  { title: "The Dark Crystal", released: 1982, directors: [78] },
  { title: "The City of Lost Children", released: 1995, directors: [49, 50] },
  { title: "Mars Attacks", released: 1996, directors: [79] },
  { title: "Strange Brew", released: 1983, directors: [90, 91] },
  { title: "Die Hard", released: 1988, directors: [33] },
  { title: "The Big Lebowski", released: 1998, directors: [3] },
  { title: "The Hunt for Red October", released: 1990, directors: [33] },
  { title: "Raiders of the Lost Ark", released: 1981, directors: [5] },
  { title: "Office Space", released: 1999, directors: [40] },
  { title: "Apocalypse Now", released: 1979, directors: [39] },
  { title: "Aliens", released: 1986, directors: [1] },
  { title: "Total Recall", released: 1990, directors: [36] },
  { title: "Inception", released: 2010, directors: [9] },
  { title: "Full Metal Jacket", released: 1987, directors: [35] },
  { title: "THX1138", released: 1971, directors: [18] },
  { title: "The Silence of the Lambs", released: 1991, directors: [34] },
  { title: "Predator", released: 1987, directors: [33] },
  { title: "Daft Punk's Electroma", released: 2006 },
  { title: "Evil Dead", released: 1981, directors: [32] },
  { title: "Event Horizon", released: 1997, directors: [31] },
  { title: "Inglourious Basterds", released: 2009, directors: [7] }
]);

export default movies;
