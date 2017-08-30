import Immutable from "immutable";


const directors2 = [
  { id: 0, name: "Ridley Scott" },
  { id: 1, name: "James Cameron" },
  { id: 2, name: "Terry Gilliam" },
  { id: 3, name: "Joel Coen" },
  { id: 4, name: "Ethan Coen" },
  { id: 5, name: "Steven Spielberg" },
  { id: 6, name: "David Fincher" },
  { id: 7, name: "Quentin Tarantino" },
  { id: 8, name: "Robert Rodriguez" },
  { id: 9, name: "Christopher Nolan" },
  { id: 10, name: "Martin Scorsese" },
  { id: 11, name: "Ron Shelton" },
  { id: 12, name: "Katheryn Bigelow" },
  { id: 13, name: "Roger Avary" },
  { id: 14, name: "Brian De Palma" },
  { id: 15, name: "John Badham" },
  { id: 16, name: "George Miller" },
  { id: 17, name: "Matthew Vaughn" },
  { id: 18, name: "George Lucas" },
  { id: 19, name: "Michael Cimino" },
  { id: 20, name: "Stephen King" },
  { id: 21, name: "Kevin Smith" },
  { id: 22, name: "John Hughes" },
  { id: 23, name: "Luc Besson" },
  { id: 24, name: "Louis Leterrier" },
  { id: 25, name: "Corey Yuen" },
  { id: 26, name: "Steven Lisberger" },
  { id: 27, name: "Ben Stiller" },
  { id: 28, name: "Doug Liman" },
  { id: 29, name: "Tom Shadyac" },
  { id: 30, name: "Rob Reiner" },
  [31, "Paul Anderson"],
  [32, "Sam Raimi"],
  [33, "John McTiernan"],
  [34, "Jonathan Demme"],
  [35, "Stanley Kubrick"],
  [36, "Paul Verhoeven"],
  [37, "Mary Lambert"],
  [38, "Steve Barron"],
  [39, "Francis Ford Coppola"],
  [40, "Mike Judge"],
  [41, "John Carpenter"],
  [42, "Jan de Bont"],
  [43, "Peter Segal"],
  [44, "Tamra Davis"],
  [45, "John Lasseter"],
  [46, "Brett Leonard"],
  [47, "Les Mayfield"],
  [48, "Barry Sonnenfeld"],
  [49, "Marc Caro"],
  [50, "Jean-Pierre Jeunet"],
  [51, "Stephen Herek"],
  [52, "David Cronenberg"],
  [53, "Trey Parker"],
  [54, "Joel Schumacher"],
  [55, "Phil Lord"],
  [56, "Christopher Miller"],
  [57, "Jay Levey"],
  [58, "Tom Tykwer"],
  [59, "Judd Apatow"],
  [60, "Troy Duffy"],
  [61, "Steve Pink"],
  [62, "Joe Wright"],
  [63, "Barry Levinson"],
  [64, "Harold Ramis"],
  [65, "Walt Becker"],
  [66, "Paul Weitz"],
  [67, "Jonathan Lynn"],
  [68, "Mel Brooks"],
  [69, "Gus Van Sant"],
  [70, "Martha Coolidge"],
  [71, "Hal Needham"],
  [72, "Peter Farrelly"],
  [73, "Spike Jonze"],
  [74, "Penelope Spheeris"],
  [75, "John Frankenheimer"],
  [76, "Robert Zemeckis"],
  [77, "Zack Snyder"],
  [78, "Jim Henson"],
  [79, "Tim Burton"],
  [80, "Stuart Gordon"],
  [81, "Jay Chandrasekhar"],
  [82, "Desmond Davis"],
  [83, "Ivan Reitman"],
  [84, "John Landis"],
  [85, "Sam Mendes"],
  [86, "Richard Kelly"],
  [87, "Sofia Coppola"],
  [88, "Ruben Fleischer"],
  [89, "Jared Hess"],
  [90, "Rick Moranis"],
  [91, "Dave Thomas"],
  [92, "Wes Anderson"],
  [92, "Chris Columbus"],
  [93, "David Twohy"],
  [94, "Harold Becker"],
  [95, "Mark Neveldine"],
  [96, "Brian Taylor"],
  [97, "Dean DeBlois"],
  [98, "Chris Sanders"],
  [99, "Marshall Brickman"],
  [100, "Frank Coraci"],
  [101, "Dan O'Bannon"],
  [102, "Michael Herz"],
  [103, "Lloyd Kaufman"],
  [104, "Peter Weir"],
  [105, "James Mangold"],
  [106, "Guillermo del Toro"],
  [107, "Andrew Stanton"],
  [108, "Tarsem Singh"],
  [109, "Martin Brest"],
  [110, "Ted Kotcheff"],
  [111, "Katsuhiro Ôtomo"],
  [112, "Patty Jenkins"],
  [113, "John Milius"],
  [114, "Hugh Wilson"],
  [115, "Alan Metter"],
  [116, "Fred M. Wilcox"],
  [117, "Thom Eberhardt"],
  [118, "Jeff Kanew"],
  [119, "David Zucker"],
  [120, "Robert Ben Garant"],
  [121, "Milos Forman"],
  [122, "Jay Roach"],
  [123, "Wolfgang Petersen"],
  [124, "Byron Haskin"],
  [125, "Randal Kleiser"],
  [126, "Mike Mitchell"],
  [127, "Robert Wise"],
  [128, "Alejandro González Iñárritu"],
  [129, "Terry Jones"],
  [130, "Robert Schwentke"],
  [131, "Jonathan Levine"],
  [132, "Gareth Carrivick"],
  [133, "Neil Burger"],
  [134, "M. Night Shyamalan"],
  [135, "Mary Harron"],
  [136, "Garth Jennings"],
  [137, "Alfonso Cuarón"],
  [138, "Andrew Niccol"],
  [139, "Frank Darabont"],
  [140, "Fritz Lang"],
  [141, "Nicholas Meyer"],
  [142, "Darren Aronofsky"],
  [143, "Bryan Singer"],
  [144, "Jon Favreau"],
  [145, "Lou Adler"],
  [146, "Peter Chung"],
  [147, "Ron Howard"],
  [148, "Tony Kaye"],
  [149, "Steven Soderbergh"]
];

const directors = Immutable.Map([
  [0, "Ridley Scott"],
  [1, "James Cameron"],
  [2, "Terry Gilliam"],
  [3, "Joel Coen"],
  [4, "Ethan Coen"],
  [5, "Steven Spielberg"],
  [6, "David Fincher"],
  [7, "Quentin Tarantino"],
  [8, "Robert Rodriguez"],
  [9, "Christopher Nolan"],
  [10, "Martin Scorsese"],
  [11, "Ron Shelton"],
  [12, "Katheryn Bigelow"],
  [13, "Roger Avary"],
  [14, "Brian De Palma"],
  [15, "John Badham"],
  [16, "George Miller"],
  [17, "Matthew Vaughn"],
  [18, "George Lucas"],
  [19, "Michael Cimino"],
  [20, "Stephen King"],
  [21, "Kevin Smith"],
  [22, "John Hughes"],
  [23, "Luc Besson"],
  [24, "Louis Leterrier"],
  [25, "Corey Yuen"],
  [26, "Steven Lisberger"],
  [27, "Ben Stiller"],
  [28, "Doug Liman"],
  [29, "Tom Shadyac"],
  [30, "Rob Reiner"],
  [31, "Paul Anderson"],
  [32, "Sam Raimi"],
  [33, "John McTiernan"],
  [34, "Jonathan Demme"],
  [35, "Stanley Kubrick"],
  [36, "Paul Verhoeven"],
  [37, "Mary Lambert"],
  [38, "Steve Barron"],
  [39, "Francis Ford Coppola"],
  [40, "Mike Judge"],
  [41, "John Carpenter"],
  [42, "Jan de Bont"],
  [43, "Peter Segal"],
  [44, "Tamra Davis"],
  [45, "John Lasseter"],
  [46, "Brett Leonard"],
  [47, "Les Mayfield"],
  [48, "Barry Sonnenfeld"],
  [49, "Marc Caro"],
  [50, "Jean-Pierre Jeunet"],
  [51, "Stephen Herek"],
  [52, "David Cronenberg"],
  [53, "Trey Parker"],
  [54, "Joel Schumacher"],
  [55, "Phil Lord"],
  [56, "Christopher Miller"],
  [57, "Jay Levey"],
  [58, "Tom Tykwer"],
  [59, "Judd Apatow"],
  [60, "Troy Duffy"],
  [61, "Steve Pink"],
  [62, "Joe Wright"],
  [63, "Barry Levinson"],
  [64, "Harold Ramis"],
  [65, "Walt Becker"],
  [66, "Paul Weitz"],
  [67, "Jonathan Lynn"],
  [68, "Mel Brooks"],
  [69, "Gus Van Sant"],
  [70, "Martha Coolidge"],
  [71, "Hal Needham"],
  [72, "Peter Farrelly"],
  [73, "Spike Jonze"],
  [74, "Penelope Spheeris"],
  [75, "John Frankenheimer"],
  [76, "Robert Zemeckis"],
  [77, "Zack Snyder"],
  [78, "Jim Henson"],
  [79, "Tim Burton"],
  [80, "Stuart Gordon"],
  [81, "Jay Chandrasekhar"],
  [82, "Desmond Davis"],
  [83, "Ivan Reitman"],
  [84, "John Landis"],
  [85, "Sam Mendes"],
  [86, "Richard Kelly"],
  [87, "Sofia Coppola"],
  [88, "Ruben Fleischer"],
  [89, "Jared Hess"],
  [90, "Rick Moranis"],
  [91, "Dave Thomas"],
  [92, "Wes Anderson"],
  [92, "Chris Columbus"],
  [93, "David Twohy"],
  [94, "Harold Becker"],
  [95, "Mark Neveldine"],
  [96, "Brian Taylor"],
  [97, "Dean DeBlois"],
  [98, "Chris Sanders"],
  [99, "Marshall Brickman"],
  [100, "Frank Coraci"],
  [101, "Dan O'Bannon"],
  [102, "Michael Herz"],
  [103, "Lloyd Kaufman"],
  [104, "Peter Weir"],
  [105, "James Mangold"],
  [106, "Guillermo del Toro"],
  [107, "Andrew Stanton"],
  [108, "Tarsem Singh"],
  [109, "Martin Brest"],
  [110, "Ted Kotcheff"],
  [111, "Katsuhiro Ôtomo"],
  [112, "Patty Jenkins"],
  [113, "John Milius"],
  [114, "Hugh Wilson"],
  [115, "Alan Metter"],
  [116, "Fred M. Wilcox"],
  [117, "Thom Eberhardt"],
  [118, "Jeff Kanew"],
  [119, "David Zucker"],
  [120, "Robert Ben Garant"],
  [121, "Milos Forman"],
  [122, "Jay Roach"],
  [123, "Wolfgang Petersen"],
  [124, "Byron Haskin"],
  [125, "Randal Kleiser"],
  [126, "Mike Mitchell"],
  [127, "Robert Wise"],
  [128, "Alejandro González Iñárritu"],
  [129, "Terry Jones"],
  [130, "Robert Schwentke"],
  [131, "Jonathan Levine"],
  [132, "Gareth Carrivick"],
  [133, "Neil Burger"],
  [134, "M. Night Shyamalan"],
  [135, "Mary Harron"],
  [136, "Garth Jennings"],
  [137, "Alfonso Cuarón"],
  [138, "Andrew Niccol"],
  [139, "Frank Darabont"],
  [140, "Fritz Lang"],
  [141, "Nicholas Meyer"],
  [142, "Darren Aronofsky"],
  [143, "Bryan Singer"],
  [144, "Jon Favreau"],
  [145, "Lou Adler"],
  [146, "Peter Chung"],
  [147, "Ron Howard"],
  [148, "Tony Kaye"],
  [149, "Steven Soderbergh"]
]);

export default directors;
