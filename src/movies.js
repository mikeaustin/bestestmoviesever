import Immutable from "immutable";


const movies = [
  { id: 0, title: "Close Encounters of the Third Kind", released: 1977, directors: [5], categories: [1, 0] },
  { id: 1, title: "Gangs of New York", released: 2002, directors: [10], categories: [3, 1] },
  { id: 2, title: "Prince of Darkness", released: 1987, directors: [41], categories: [5, 8] },
  { id: 3, title: "The Blues Brothers", released: 1980, directors: [84], categories: [4, 2, 3, 9] },
  { id: 4, title: "RED", released: 2010, directors: [130], categories: [4, 2, 3, 5] },
  { id: 5, title: "21 Grams", released: 2003, directors: [128], categories: [3, 1, 5] },
  { id: 6, title: "Idiocracy", released: 2006, directors: [40], categories: [6, 2, 0] },
  { id: 7, title: "Escape from New York", released: 1981, directors: [41], categories: [4, 0] },
  { id: 8, title: "Clerks", released: 1994, directors: [21], categories: [2] },
  { id: 9, title: "Death Race", released: 2008, directors: [31], categories: [4, 0, 5] },
  { id: 10, title: "Spies Like Us", released: 1985, directors: [84], categories: [6, 2] },
  { id: 11, title: "¡Three Amigos!", released: 1986, directors: [84], categories: [2, 7] },
  { id: 12, title: "Alien", released: 1979, directors: [0], categories: [8, 0] },
  { id: 13, title: "A.I. Artificial Intelligence", released: 2001, directors: [5], categories: [6, 1, 0] },
  { id: 14, title: "Catch Me If You Can", released: 2002, directors: [5], categories: [3, 1] },
  { id: 15, title: "Minority Report", released: 2002, directors: [5], categories: [4, 6, 3, 1, 14, 0, 5] },
  { id: 16, title: "Teenage Mutant Ninja Turtles", released: 1990, directors: [38], categories: [4, 6, 2, 15, 0] },
  { id: 17, title: "Electric Dreams", released: 1984, directors: [38], categories: [2, 1, 9] },
  { id: 18, title: "Zero Dark Thirty", released: 2012, directors: [12], categories: [1, 13, 5] },
  { id: 19, title: "The Cable Guy", released: 1996, directors: [27], categories: [2, 1, 5] },
  { id: 20, title: "O Brother Where Art Thou?", image: "O_Brother_Where_Art_Thou", released: 2000, directors: [3], categories: [6, 2, 3, 9] },
  { id: 21, title: "El Mariachi", released: 1992, directors: [8], categories: [4, 5] },
  { id: 22, title: "Kick-Ass", released: 2010, directors: [17], categories: [4, 2] },
  { id: 23, title: "Dead Poets Society", released: 1989, directors: [104], categories: [2, 1] },
  { id: 24, title: "Twister", released: 1996, directors: [42], categories: [4, 6, 1, 5] },
  { id: 25, title: "The Breakfast Club", released: 1985, directors: [22], categories: [2, 1] },
  { id: 26, title: "FAQ About Time Travel", released: 2009, directors: [132], categories: [2, 0] },
  { id: 27, title: "50 First Dates", released: 2004, directors: [43], categories: [2, 12] },
  { id: 28, title: "Tommy Boy", released: 1995, directors: [43], categories: [6, 2] },
  { id: 29, title: "Billy Madison", released: 1995, directors: [44], categories: [2] },
  { id: 30, title: "12 Monkeys", released: 1995, directors: [2], categories: [14, 0, 5] },
  { id: 31, title: "Monty Python and the Holy Grail", released: 1975, directors: [2, 129], categories: [6, 2, 10] },
  { id: 32, title: "Toy Story", released: 1995, directors: [45], categories: [11, 6, 2, 15, 10] },
  { id: 33, title: "The Lawnmower Man", released: 1992, directors: [46], categories: [6, 0] },
  { id: 34, title: "Encino Man", released: 1992, directors: [47], categories: [2] },
  { id: 35, title: "White Men Can’t Jump", released: 1992, directors: [11], categories: [2, 1, 16] },
  { id: 36, title: "The Addams Family", released: 1991, directors: [48], categories: [2, 10] },
  { id: 37, title: "Delicatessen", released: 1991, directors: [49, 50], categories: [2, 3] },
  { id: 38, title: "Point Break", released: 1991, directors: [12], categories: [4, 3, 1, 5] },
  { id: 39, title: "Terminator 2: Judgment Day", image: "Terminator_2_Judgment_Day", released: 1991, directors: [1], categories: [4, 0, 5] },
  { id: 40, title: "Bill & Ted’s Excellent Adventure", released: 1989, directors: [51], categories: [6, 2, 9, 0] },
  { id: 41, title: "The Fly", released: 1986, directors: [52], categories: [1, 8, 0] },
  { id: 42, title: "Videodrome", released: 1983, directors: [52], categories: [8, 0, 5] },
  { id: 43, title: "They Live", released: 1988, directors: [41], categories: [4, 8, 0, 5] },
  { id: 44, title: "Fargo", released: 1996, directors: [3], categories: [3, 1, 5] },
  { id: 45, title: "Pet Sematary", released: 1989, directors: [37], categories: [8, 5] },
  { id: 46, title: "Team America: World Police", image: "Team_America_World_Police", released: 2004, directors: [53], categories: [4, 2] },
  { id: 47, title: "Flatliners", released: 1990, directors: [54], categories: [1, 8, 0, 5] },
  { id: 48, title: "The Lego Movie", released: 2014, directors: [55, 56], categories: [11, 4, 6] },
  { id: 49, title: "21 Jump Street", released: 2012, directors: [55, 56], categories: [4, 2, 3] },
  { id: 50, title: "Cloudy with a Chance of Meatballs", released: 2009, directors: [55, 56], categories: [11, 6, 2, 15, 10, 0] },
  { id: 51, title: "This is Spinal Tap", released: 1984, directors: [30], categories: [2, 9] },
  { id: 52, title: "UHF", released: 1989, directors: [57], categories: [2, 1] },
  { id: 53, title: "The 40 Year-Old Virgin", released: 2005, directors: [59], categories: [2, 12] },
  { id: 54, title: "Kill Bill Volume 1", released: 2003, directors: [7], categories: [4, 3, 5] },
  { id: 55, title: "Run Lola Run", released: 1998, directors: [58], categories: [3, 1, 5] },
  { id: 56, title: "La Femme Nikita", released: 1990, directors: [23], categories: [4, 5] },
  { id: 57, title: "The Boondock Saints", released: 1999, directors: [60], categories: [4, 3, 5] },
  { id: 58, title: "Killing Zoe", released: 1994, directors: [13], categories: [3, 5] },
  { id: 59, title: "Accepted", released: 2006, directors: [61], categories: [2] },
  { id: 60, title: "Hanna", released: 2011, directors: [62], categories: [4, 1, 5] },
  { id: 61, title: "Sphere", released: 1998, directors: [63], categories: [1, 8, 14, 0, 5] },
  { id: 62, title: "National Lampoon’s Vacation", released: 1983, directors: [64], categories: [6, 2] },
  { id: 63, title: "National Lampoon’s Van Wilder", released: 2002, directors: [65], categories: [2, 12] },
  { id: 64, title: "American Pie", released: 1999, directors: [66], categories: [2] },
  { id: 65, title: "My Cousin Vinny", released: 1992, directors: [67], categories: [2, 3] },
  { id: 66, title: "Robin Hood: Men in Tights", image: "Robin_Hood_Men_in_Tights", released: 1993, directors: [68], categories: [6, 2, 9, 12] },
  { id: 67, title: "Scarface", released: 1983, directors: [14], categories: [3, 1] },
  { id: 68, title: "Good Will Hunting", released: 1997, directors: [69], categories: [1] },
  { id: 69, title: "Bruce Almighty", released: 2003, directors: [29], categories: [2, 1, 10] },
  { id: 70, title: "Real Genius", released: 1985, directors: [70], categories: [2, 12, 0] },
  { id: 71, title: "Misery", released: 1990, directors: [30], categories: [3, 1, 5] },
  { id: 72, title: "Rad", released: 1986, directors: [71], categories: [1, 16] },
  { id: 73, title: "Dumb and Dumber", released: 1994, directors: [72], categories: [2] },
  { id: 74, title: "Seven", released: 1995, directors: [6], categories: [3, 1, 14, 5] },
  { id: 75, title: "Blade Runner", released: 1982, category: 1, directors: [0], categories: [0, 5] },
  { id: 76, title: "The Terminator", released: 1984, directors: [1], categories: [4, 0] },
  { id: 77, title: "The Life Aquatic with Steve Zissou", released: 2004, directors: [92], categories: [6, 2, 1] },
  { id: 78, title: "Tigerland", released: 2000, directors: [54], categories: [1, 17] },
  { id: 79, title: "The Lost Boys", released: 1987, directors: [54], categories: [2, 8] },
  { id: 80, title: "How to Train Your Dragon", released: 2010, directors: [97, 98], categories: [11, 4, 6, 2, 15, 10] },
  { id: 81, title: "Mad Max", released: 1980, directors: [16], categories: [4, 6, 0, 5] },
  { id: 82, title: "Short Circuit", released: 1986, directors: [15], categories: [2, 15, 0] },
  { id: 83, title: "Mrs. Doubtfire", image: "Mrs_Doubtfire", released: 1993, directors: [92], categories: [2, 1, 15] },
  { id: 84, title: "The Manhattan Project", released: 1986, directors: [99], categories: [0, 5] },
  { id: 85, title: "Airplane!", released: 1980, directors: [], categories: [2] },
  { id: 86, title: "RoboCop", released: 1987, directors: [36], categories: [4, 4, 0, 5] },
  { id: 87, title: "E.T. the Extra Terrestrial", released: 1982, directors: [5], categories: [15, 0] },
  { id: 88, title: "The Cell", released: 2000, directors: [108], categories: [8, 0, 5] },
  { id: 89, title: "The Waterboy", released: 1998, directors: [100], categories: [2, 16] },
  { id: 90, title: "WarGames", released: 1983, directors: [15], categories: [0, 5] },
  { id: 91, title: "Star Wars: Episone IV - A New Hope", image: "Star_Wars", released: 1977, directors: [18], categories: [4, 6, 10, 0] },
  { id: 92, title: "Beverly Hills Cop", released: 1984, directors: [109], categories: [4, 2, 3] },
  { id: 93, title: "AKIRA", released: 1988, directors: [111], categories: [11, 4, 1, 0, 5] },
  { id: 94, title: "The Deer Hunter", released: 1978, directors: [19], categories: [1, 17] },
  { id: 95, title: "Police Academy", released: 1984, directors: [114], categories: [2] },
  { id: 96, title: "Forbidden Planet", released: 1956, directors: [116], categories: [4, 6, 0, 5] },
  { id: 97, title: "Layer Cake", released: 2004, directors: [17], categories: [3, 1, 5] },
  { id: 98, title: "Crank", released: 2006, directors: [95, 96], categories: [4, 3, 5] },
  { id: 99, title: "The Transporter", released: 2002, directors: [24, 25], categories: [4, 3, 5] },
  { id: 100, title: "The Return of the Living Dead", released: 1985, directors: [101], categories: [2, 8] },
  { id: 101, title: "The Toxic Avenger", released: 1986, directors: [102, 103], categories: [4, 2, 8, 0] },
  { id: 102, title: "Young Frankenstein", released: 1974, directors: [68], categories: [2] },
  { id: 103, title: "2001: A Space Odyssey", image: "2001_A_Space_Odyssey", released: 1968, directors: [35], categories: [6, 0] },
  { id: 104, title: "Dr. Strangelove", released: 1964, directors: [35], categories: [2] },
  { id: 105, title: "The Day the Earth Stood Still", released: 1951, directors: [127], categories: [1, 0] },
  { id: 106, title: "The War of the Worlds", released: 1953, directors: [124], categories: [4, 8, 0, 5] },
  { id: 107, title: "Spaceballs", released: 1987, directors: [68], categories: [6, 2, 0] },
  { id: 108, title: "Pitch Black", released: 2000, directors: [93], categories: [8, 0] },
  { id: 109, title: "Maximum Overdrive", released: 1986, directors: [20], categories: [4, 2, 8, 0] },
  { id: 110, title: "Deuce Bigalow: Male Gigolo", image: "Deuce_Bigalow_Male_Gigolo", released: 1999, directors: [126], categories: [2, 12] },
  { id: 111, title: "Reservoir Dogs", released: 1992, directors: [7], categories: [3, 1, 5] },
  { id: 112, title: "Taps", released: 1981, directors: [94], categories: [1] },
  { id: 113, title: "Night of the Comet", released: 1984, directors: [117], categories: [2, 8, 0] },
  { id: 114, title: "Star Wars: The Empire Strikes Back", image: "Star_Wars_The_Empire_Strikes_Back", released: 1980, directors: [18], categories: [4, 6, 10, 0] },
  { id: 115, title: "Fear and Loathing in Las Vegas", released: 1998, directors: [2], categories: [6, 2, 1] },
  { id: 116, title: "Mallrats", released: 1995, directors: [21], categories: [2, 12] },
  { id: 117, title: "The NeverEnding Story", released: 1984, directors: [123], categories: [6, 1, 15, 10] },
  { id: 118, title: "Time Bandits", released: 1981, directors: [2], categories: [6, 2, 10, 0] },
  { id: 119, title: "The Princess Bride", released: 1987, directors: [30], categories: [6, 15, 10, 12] },
  { id: 120, title: "Gremlins", released: 1984, directors: [92], categories: [2, 10, 8] },
  { id: 121, title: "Pulp Fiction", released: 1994, directors: [7], categories: [3, 1] },
  { id: 122, title: "Ferris Bueller’s Day Off", released: 1986, directors: [22], categories: [2] },
  { id: 123, title: "Fight Club", released: 1999, directors: [6], categories: [1] },
  { id: 124, title: "Revenge of the Nerds", released: 1984, directors: [118], categories: [2] },
  { id: 125, title: "Weird Science", released: 1985, directors: [22], categories: [2, 12, 0] },
  { id: 126, title: "The Goonies", released: 1985, directors: [92], categories: [6, 2, 15] },
  { id: 127, title: "Tron", released: 1982, directors: [26], categories: [4, 6, 0] },
  { id: 128, title: "Tropic Thunder", released: 2008, directors: [27], categories: [4, 2] },
  { id: 129, title: "Wonder Woman", released: 2017, directors: [112], categories: [4, 6, 10] },
  { id: 130, title: "Logan", released: 2017, directors: [105], categories: [4, 1, 0] },
  { id: 131, title: "The Fifth Element", released: 1997, directors: [23], categories: [4, 6, 0] },
  { id: 132, title: "The Truman Show", released: 1998, directors: [104], categories: [2, 1, 0] },
  { id: 133, title: "Hellboy", released: 2004, directors: [106], categories: [4, 10, 8, 0] },
  { id: 134, title: "WALL-E", released: 2008, directors: [107], categories: [11, 6, 15, 0] },
  { id: 135, title: "Edge of Tomorrow", released: 2014, directors: [28], categories: [4, 6, 0] },
  { id: 136, title: "Ace Ventura: Pet Detective", image: "Ace_Ventura_Pet_Detective", released: 1994, directors: [29], categories: [2] },
  { id: 137, title: "The Thing", released: 1982, directors: [41], categories: [8, 14, 0] },
  { id: 138, title: "The Matrix", released: 1999, directors: [3, 4], categories: [4, 0] },
  { id: 139, title: "Back to School", released: 1986, directors: [115], categories: [2, 12, 16] },
  { id: 140, title: "Re-Animator", image: "Reanimator", released: 1985, directors: [80], categories: [2, 8, 0] },
  { id: 141, title: "Edward Scissorhands", released: 1990, directors: [79], categories: [1, 10, 12] },
  { id: 142, title: "Uncle Buck", released: 1989, directors: [22], categories: [2] },
  { id: 143, title: "Super Troopers", released: 2002, directors: [81], categories: [2, 3, 14] },
  { id: 144, title: "Beerfest", released: 2006, directors: [81], categories: [2] },
  { id: 145, title: "Clash of the Titans", released: 1981, directors: [82], categories: [4, 6, 15, 10] },
  { id: 146, title: "A Clockwork Orange", released: 1972, directors: [35], categories: [3, 1, 0] },
  { id: 147, title: "Big Trouble in Little China", released: 1986, directors: [41], categories: [4, 6, 2, 10] },
  { id: 148, title: "Ghostbusters", released: 1984, directors: [83], categories: [4, 6, 2, 10] },
  { id: 149, title: "One Flew Over the Cuckoo’s Nest", released: 1975, directors: [121], categories: [1] },
  { id: 150, title: "Taxi Driver", released: 1976, directors: [10], categories: [3, 1] },
  { id: 151, title: "The Shining", released: 1980, directors: [35], categories: [1, 8] },
  { id: 152, title: "Rambo: First Blood", image: "Rambo_First_Blood", released: 1982, directors: [110], categories: [4, 6, 1] },
  { id: 153, title: "Red Dawn", released: 1984, directors: [113], categories: [4, 1] },
  { id: 154, title: "Rain Man", released: 1988, directors: [63], categories: [1] },
  { id: 155, title: "The Naked Gun", released: 1988, directors: [119], categories: [2, 3] },
  { id: 156, title: "Flight of the Navigator", released: 1986, directors: [125], categories: [6, 15, 0] },
  { id: 157, title: "Balls of Fury", released: 2007, directors: [120], categories: [2, 3, 16] },
  { id: 158, title: "Raising Arizona", released: 1987, directors: [3], categories: [2, 3] },
  { id: 159, title: "An American Werewolf in London", released: 1981, directors: [84], categories: [2, 8] },
  { id: 160, title: "Beetlejuice", released: 1988, directors: [79], categories: [2, 10] },
  { id: 161, title: "American Beauty", released: 1999, directors: [85], categories: [1, 12] },
  { id: 162, title: "Snatch", released: 2001, directors: [17], categories: [2, 3] },
  { id: 163, title: "Memento", released: 2000, directors: [9], categories: [14, 5] },
  { id: 164, title: "Donnie Darko", released: 2001, directors: [86], categories: [1, 0, 5] },
  { id: 165, title: "Lost in Translation", released: 2003, directors: [87], categories: [1] },
  { id: 166, title: "Zombieland", released: 2009, directors: [88], categories: [6, 2, 8, 0] },
  { id: 167, title: "Napoleon Dynamite", released: 2004, directors: [89], categories: [2] },
  { id: 168, title: "Being John Malkovich", released: 1999, directors: [73], categories: [2, 1, 10] },
  { id: 169, title: "Her", released: 2013, directors: [73], categories: [1, 12, 0] },
  { id: 170, title: "There’s Something About Mary", released: 1998, directors: [72], categories: [2, 12] },
  { id: 171, title: "Men in Black", released: 1997, directors: [48], categories: [6, 2, 15, 14, 0] },
  { id: 172, title: "Groundhog Day", released: 1993, directors: [64], categories: [2, 10, 12] },
  { id: 173, title: "Wayne’s World", released: 1992, directors: [74], categories: [2, 9] },
  { id: 174, title: "Army of Darkness", released: 1993, directors: [32], categories: [2, 8] },
  { id: 175, title: "Jurassic Park", released: 1993, directors: [5], categories: [6, 0, 5] },
  { id: 176, title: "Leon The Professional", released: 1994, directors: [23], categories: [3, 1, 5] },
  { id: 177, title: "Ronin", released: 1998, directors: [75], categories: [4, 6, 3, 5] },
  { id: 178, title: "Austin Powers: International Man of Mystery", image: "Austin_Powers_International_Man_of_Mystery", released: 1997, directors: [122], categories: [6, 2] },
  { id: 179, title: "Gladiator", released: 2000, directors: [0], categories: [4, 6, 1] },
  { id: 180, title: "Black Hawk Down", released: 2001, directors: [0], categories: [1, 13, 17] },
  { id: 181, title: "Back to the Future", released: 1985, directors: [76], categories: [6, 2, 0] },
  { id: 182, title: "Batman Begins", released: 2005, directors: [9], categories: [4, 6] },
  { id: 183, title: "300", released: 2006, directors: [77], categories: [4, 10] },
  { id: 184, title: "No Country for Old Men", released: 2007, directors: [3, 4], categories: [3, 1, 5] },
  { id: 185, title: "From Dusk Till Dawn", released: 1996, directors: [8], categories: [4, 3, 8] },
  { id: 186, title: "The Dark Crystal", released: 1982, directors: [78], categories: [6, 15, 10] },
  { id: 187, title: "The City of Lost Children", released: 1995, directors: [49, 50], categories: [10, 0] },
  { id: 188, title: "Mars Attacks", released: 1996, directors: [79], categories: [2, 0] },
  { id: 189, title: "Strange Brew", released: 1983, directors: [90, 91], categories: [2] },
  { id: 190, title: "Die Hard", released: 1988, directors: [33], categories: [4, 5] },
  { id: 191, title: "The Big Lebowski", released: 1998, directors: [3], categories: [2, 3] },
  { id: 192, title: "The Hunt for Red October", released: 1990, directors: [33], categories: [4, 6, 5] },
  { id: 193, title: "Raiders of the Lost Ark", released: 1981, directors: [5], categories: [4, 5] },
  { id: 194, title: "Office Space", released: 1999, directors: [40], categories: [2] },
  { id: 195, title: "Apocalypse Now", released: 1979, directors: [39], categories: [1, 17] },
  { id: 196, title: "Aliens", released: 1986, directors: [1], categories: [4, 6, 0, 5] },
  { id: 197, title: "Total Recall", released: 1990, directors: [36], categories: [4, 0, 5] },
  { id: 198, title: "Inception", released: 2010, directors: [9], categories: [4, 6, 0, 5] },
  { id: 199, title: "Full Metal Jacket", released: 1987, directors: [35], categories: [1, 17] },
  { id: 200, title: "THX 1138", released: 1971, directors: [18], categories: [1, 0, 5] },
  { id: 201, title: "The Silence of the Lambs", released: 1991, directors: [34], categories: [3, 1, 5] },
  { id: 202, title: "Predator", released: 1987, directors: [33], categories: [4, 0, 5] },
  { id: 203, title: "Daft Punk’s Electroma", released: 2006, directors: [], categories: [1, 0, 9] },
  { id: 204, title: "The Evil Dead", released: 1981, directors: [32], categories: [8] },
  { id: 205, title: "Event Horizon", released: 1997, directors: [31], categories: [8, 0, 5] },
  { id: 206, title: "Inglourious Bastards", released: 2009, directors: [7], categories: [4, 6, 17] },
  { id: 207, title: "Warm Bodies", released: 2013, directors: [131], categories: [2, 8, 12] },
  { id: 208, title: "Limitless", released: 2011, directors: [133], categories: [14, 0, 5] },
  { id: 209, title: "Unbreakable", released: 2000, directors: [134], categories: [1, 14, 0, 5] },
  { id: 210, title: "American Psycho", released: 2000, directors: [135], categories: [3, 1] },
  { id: 211, title: "The Dark Knight", released: 2008, directors: [9], categories: [4, 3, 1, 5] },
  { id: 212, title: "The Hitchhiker’s Guide to the Galaxy", released: 2005, directors: [136], categories: [6, 2, 0] },
  { id: 213, title: "Children of Men", released: 2006, directors: [137], categories: [1, 0, 5] },
  { id: 214, title: "Gattaca", released: 1997, directors: [138], categories: [1, 0, 5] },
  { id: 215, title: "The Green Mile", released: 1999, directors: [139], categories: [3, 1, 10, 14] },
  { id: 216, title: "The Chronicles of Riddick", released: 2004, directors: [93], categories: [4, 6, 0, 5] },
  { id: 217, title: "Metropolis", released: 1927, directors: [140], categories: [1, 0] },
  { id: 218, title: "Star Trek II: The Wrath of Khan", image: "Star_Trek_II_The_Wrath_of_Khan", released: 1982, directors: [141], categories: [4, 6, 0] },
  { id: 219, title: "Requiem for a Dream", released: 2000, directors: [142], categories: [1] },
  { id: 220, title: "Valkyrie", released: 2008, directors: [143], categories: [1, 13, 5, 17] },
  { id: 221, title: "X-Men: Days of Future Past", image: "X-Men_Days_of_Future_Past", released: 2014, directors: [143], categories: [4, 6, 0, 5] },
  { id: 222, title: "Iron Man", released: 2008, directors: [144], categories: [4, 6, 0] },
  { id: 223, title: "X-Men", released: 2000, directors: [143], categories: [4, 6, 0] },
  { id: 224, title: "Up in Smoke", released: 1978, directors: [145], categories: [2, 9] },
  { id: 225, title: "The Chronicles of Riddick: Dark Fury", released: 2004, directors: [146], categories: [4, 11, 0] },
  { id: 226, title: "A Beautiful Mind", released: 2001, directors: [147], categories: [1] },
  { id: 227, title: "Apollo 13", released: 1995, directors: [147], categories: [6, 1, 13] },
  { id: 228, title: "American History X", released: 1998, directors: [148], categories: [3, 1] },
  { id: 229, title: "Ocean’s Eleven", released: 2001, directors: [149], categories: [3, 5] },
  { id: 230, title: "The Burbs", released: 1989, directors: [150], categories: [2, 14, 5] },
  { id: 231, title: "The Adventures of Buckaroo Banzai", released: 1984, directors: [151], categories: [6, 2, 12] },
  { id: 232, title: "Sneakers", released: 1992, directors: [152], categories: [2, 3, 1] },
  { id: 233, title: "Evolution", released: 2001, directors: [83], categories: [2, 0] },
  { id: 234, title: "Men at Work", released: 1990, directors: [153], categories: [4, 2, 3] },
  { id: 235, title: "Dune", released: 1984, directors: [154], categories: [4, 6, 0] },
  { id: 236, title: "The Secret Life of Pets", released: 2016, directors: [155, 156], categories: [11, 6, 2] },
  { id: 237, title: "Deadpool", released: 2016, directors: [157], categories: [4, 6, 2] },
  { id: 238, title: "Wreck-It Ralph", released: 2012, directors: [158], categories: [11, 6, 2] },
  { id: 239, title: "Ready Player One", released: 2018, directors: [5], categories: [4, 6, 0] },
  { id: 240, title: "Bohemian Rhapsody", released: 2018, directors: [143], categories: [18, 1, 9] },
  { id: 241, title: "Judge Dredd", released: 1995, directors: [159], categories: [4, 3, 0] },
  { id: 242, title: "Dredd", released: 2012, directors: [160], categories: [4, 3, 0] },
  { id: 243, title: "Creed", released: 2015, directors: [161], categories: [1, 16] },
  { id: 244, title: "The Lego Batman Movie", released: 2017, directors: [162], categories: [11, 4, 2] },
  { id: 245, title: "Baby Driver", released: 2017, directors: [163], categories: [4, 3, 1] },
  { id: 246, title: "Guardians of the Galaxy", released: 2014, directors: [164], categories: [4, 6, 2, 0] },
  { id: 247, title: "John Wick", released: 2014, directors: [165], categories: [4, 3, 5] },
  { id: 248, title: "The Ninth Gate", released: 1999, directors: [166], categories: [14, 5] },
  { id: 249, title: "The Good, The Bad, and the Ugly", image: "The_Good_The_Bad_and_the_Ugly", released: 1966, directors: [167], categories: [7] },
  { id: 250, title: "Game Night", released: 2018, directors: [168, 169], categories: [4, 2, 3] },
  { id: 251, title: "Rampage", released: 2018, directors: [170], categories: [4, 6, 0] },
  { id: 252, title: "Pacific Rim", released: 2013, directors: [106], categories: [4, 6, 0] },
  { id: 253, title: "Early Man", released: 2018, directors: [171], categories: [11, 6, 2] },
  { id: 254, title: "Kingsman: The Secret Service", image: "Kingsman_The_Secret_Service", released: 2014, directors: [17], categories: [4, 6, 2] },
  { id: 255, title: "Sideways", released: 2004, directors: [172], categories: [2, 1, 12] },
  { id: 256, title: "Suicide Squad", released: 2016, directors: [173], categories: [4, 6, 10] },
  { id: 257, title: "The Revenant", released: 2015, directors: [174], categories: [4, 6, 18] },
  { id: 258, title: "Pixels", released: 2015, directors: [92], categories: [4, 2, 0] },
  { id: 259, title: "Big Hero 6", released: 2014, directors: [175, 176], categories: [11, 4, 6] },
  { id: 260, title: "Harold & Kumar Go to White Castle", released: 2004, directors: [177], categories: [6, 2] },
  { id: 261, title: "Horrible Bosses", released: 2011, directors: [178], categories: [2, 3] },
  { id: 262, title: "American Made", released: 2017, directors: [28], categories: [4, 18, 2] },
  { id: 263, title: "Planes, Trains and Automobiles", released: 1987, directors: [22], categories: [2] },
  { id: 264, title: "Eddie the Eagle", released: 2015, directors: [179], categories: [18, 2, 1] },
  { id: 265, title: "The Boxtrolls", released: 2014, directors: [180, 181], categories: [11, 6, 2] },
  { id: 266, title: "Zoolander", released: 2001, directors: [27], categories: [2] },
  { id: 267, title: "Half Baked", released: 1998, directors: [44], categories: [2, 3] },
  { id: 268, title: "A Night at the Roxbury", released: 1998, directors: [182], categories: [2, 9, 12] },
  { id: 269, title: "Hackers", released: 1995, directors: [183], categories: [2, 3, 1] },
  { id: 270, title: "The Accountant", released: 2016, directors: [184], categories: [4, 3, 1] },
  { id: 271, title: "Machete", released: 2010, directors: [185, 8], categories: [4, 3, 5] },
  { id: 272, title: "Despicable Me", released: 2010, directors: [186, 155], categories: [11, 2, 15] },
  { id: 273, title: "The Equalizer", released: 2014, directors: [187], categories: [4, 3, 5] },
  { id: 274, title: "Oblivion", released: 2013, directors: [188], categories: [4, 6, 14] },
  { id: 275, title: "Escape Plan", released: 2013, directors: [189], categories: [4, 3, 14] },
  { id: 276, title: "Man of Steel", released: 2013, directors: [77], categories: [4, 6, 10] },
  { id: 277, title: "Eternal Sunshine of the Spotless Mind", released: 2004, directors: [190], categories: [1, 12, 0] },
  { id: 278, title: "Shrek", released: 2001, directors: [191, 192], categories: [11, 6, 2] },
  { id: 279, title: "The Pink Panther", released: 1963, directors: [193], categories: [2, 3, 12] },
];

export default movies;
