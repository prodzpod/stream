/**
 * 1D1P.json FORMAT // ? entries are optional, ! entries are not sent to the client and only evaluated here
 * {
 *   "[WEEK NR.]": {
 *     "theme": "[text]",
 *     "description": "[text]",
 *     "css": "[text]",
 *     "puzzles": {
 *       "[name]{USERINPUT}": {
 *         "author": "[name{USERINPUT}]",
 *         "date": "[date]" // for inter-week date ordering purposes
 *         !"password": "[text{USERINPUT}]", // used to delete/edit this entry OR the master key is required
 *         ?"description": "[text{USERINPUT}]" // short text for lists
 *         "content": "[text{USERINPUT}]", // text interspliced with links of IMAGE, YT VIDEO and WEBSITE LINKS (show opengraph??) separated by commas(USERINPUT(kinda)) (auto replace)
 *         !"solution": "[text(USERINPUT)]", // separated by commads for multiple sols
 *         ?"tags": "[text(USERINPUT)]",
 *         ?"difficulty": "[number(USERINPUT)]",
 *         "css": [text{USERINPUT}{{LOL THIS IS HUGE VULN WE BALL}}],
 *         "solves": [{
 *           "name": "[name(USERINPUT)]",
 *           "comment": "[text(USERINPUT)]"
 *         }, ...],
 *       }, ...
 *     }
 *   }, ...
 * }
 * 
 * week list get format
 * {
 *     "theme": "[text]",
 *     "description": "[text]",
 *     "css": [text],
 *     "puzzles": [{
 *       "name": "[name]",
 *       "author": "[name]",
 *       "date": "[date]",
 *       ?"description": [text]",
 *       ?"tags": "[text]",
 *       ?"difficulty": "[number]",
 *       "solves": "[number: .solves.length]"
 *     }, ...]
 * }
 * 
 * search list get format
 * [{
 *   "week": "[number]"
 *   "name": "[name]",
 *   "author": "[name]",
 *   "date": "[date]",
 *   ?"description": [text]",
 *   ?"tags": "[text]",
 *   ?"difficulty": "[number]",
 *   "solves": "[number: .solves.length]"
 * }, ...]
 * 
 * methods:
 * 
 * GET /1d1p: gets puzzles from the most recent week
 * GET /1d1p?week=[n]: gets puzzles from that week
 * 
 * GET /1d1p/search: gets ALL puzzle
 * GET /1d1p/search?query=[match]&solves=[number]~[number]&author=[match]&difficulty=[number]~[number]&tags=[match]: available optional queries
 * clientside sorts: ASC/DSC, by: DATE, NAME, AUTHOR, DIFFICULTY, SOLVES
 * 
 * GET /1d1p/solve?puzzle=[week nr]-[name]: fetch all contents this time
 * 
 * POST /1d1p/submit: submit a puzzle
 * PATCH /1d1p/submit?puzzle=[week nr]-[name]: edit a puzzle with a password
 * DELETE /1d1p/submit?puzzle=[week nr]-[name]: remove a puzzle with a password
 * 
 * POST /1d1p/submitweek?week=[number]: create a week with master password
 * PATCH /1d1p/submitweek?week=[number]: edit a week with master password
 * DELETE /1d1p/submitweek?week=[number]: remove a week with master password
 * 
 * POST /1d1p/solve?puzzle=[week nr]-[name]: attempt to post a "solve comment", check with solution
 * DELETE /1d1p/solve?puzzle=[week nr]-[name]&id=[number]: removes a "solve comment" with creator or master password
 * 
 */

addEvent("onload", () => {
    
});

function getFooterButtonText(txt, bool) {
    return {
        'dark': b => b ? 'DARK' : 'LIGHT',
        'colorful': b => b ? 'C<span class="o">O</span>L<span class="o">O</span>RFUL' : 'C<span class="o">O</span>L<span class="o">O</span>RLESS',
        'flashy': b => b ? 'FLASHY' : 'STATIC',
    }[txt](bool);
}