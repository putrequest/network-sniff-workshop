import React, { useEffect, useState } from 'react';

function Sidebar() {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [inGame, setInGame] = useState(false);
	const [gameName, setGameName] = useState('');
	const id = require('uuid-readable')

	useEffect(() => {
		console.log(process.env)
		const isAuthenticated = localStorage.getItem('isAuthenticated');
		setIsLoggedIn(Boolean(isAuthenticated));

		const gameID = localStorage.getItem('activeGame');
		if (gameID) {
			setInGame(true);
			setGameName(id.short(gameID));
		}
	}, [isLoggedIn, gameName, id]);

	return (
		<aside id="default-sidebar" className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
			<div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
				<a href="/" className="flex items-center pl-2.5 mb-5">
					<img src="https://flowbite.com/docs/images/logo.svg" className="h-6 mr-3 sm:h-7" alt="Flowbite Logo" />
					<span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Poker Pro!</span>
				</a>
				<ul className="space-y-2 font-medium">
					<li>
						<a href="/" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
							<svg aria-hidden="true" className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path><path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path></svg>
							<span className="ml-3"> Main page </span>
						</a>
					</li>
					{isLoggedIn && inGame && (
						<li>
							<a href="/game/play" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
								<svg aria-hidden="true" className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 463.644 463.644" xmlSpace="preserve">
									<path id="XMLID_1_" d="M463.164,146.031l-77.369,288.746c-1.677,6.26-7.362,10.4-13.556,10.401c-1.198,0-2.414-0.155-3.625-0.479 l-189.261-50.712c-7.472-2.003-11.922-9.711-9.919-17.183l2.041-7.616c1.287-4.801,6.222-7.647,11.023-6.363 c4.801,1.287,7.65,6.222,6.363,11.023l-1.013,3.78l181.587,48.656l75.314-281.076l-77.031-20.64 c-4.801-1.287-7.651-6.222-6.364-11.023s6.225-7.648,11.022-6.364l80.869,21.668C460.718,130.853,465.167,138.56,463.164,146.031z M166.128,56.029c-4.971,0-9,4.029-9,9v8.565c0,4.971,4.029,9,9,9s9-4.029,9-9v-8.565C175.128,60.058,171.099,56.029,166.128,56.029 z M280.889,176.762c2.202,3.114,2.202,7.278,0,10.393l-41.716,58.996c-1.687,2.385-4.427,3.804-7.349,3.804 c-2.921,0-5.662-1.418-7.348-3.804l-41.718-58.996c-2.202-3.114-2.202-7.278,0-10.393l41.718-58.996 c1.687-2.385,4.427-3.804,7.348-3.804c2.922,0,5.662,1.418,7.349,3.804L280.889,176.762z M262.518,181.958l-30.694-43.408 l-30.694,43.408l30.694,43.407L262.518,181.958z M343.016,380.764l-2.216,8.273c-1.286,4.801,1.563,9.736,6.365,11.022 c0.78,0.209,1.563,0.309,2.334,0.309c3.974,0,7.611-2.653,8.688-6.674l2.216-8.273c1.286-4.801-1.563-9.736-6.365-11.022 C349.237,373.111,344.302,375.963,343.016,380.764z M112.375,215.913c2.577-0.69,5.056-1.089,7.454-1.195V32.492 c0-7.736,6.293-14.029,14.028-14.029h195.935c7.736,0,14.03,6.293,14.03,14.029v182.225c2.396,0.106,4.875,0.505,7.45,1.195 c16.511,4.424,26.346,21.457,21.922,37.968c-4.28,15.974-17.951,28.108-29.372,36.404v41.139c0,7.736-6.294,14.03-14.03,14.03 H133.857c-7.735,0-14.028-6.294-14.028-14.03v-41.137c-11.422-8.295-25.093-20.428-29.376-36.405 c-2.143-7.996-1.042-16.35,3.1-23.523C97.695,223.186,104.38,218.055,112.375,215.913z M343.821,267.05 c6.531-6.172,10.424-12,11.985-17.828c1.855-6.924-2.27-14.067-9.194-15.923c-1.047-0.281-1.97-0.451-2.791-0.538V267.05z M137.829,327.454h187.992v-41.7c-0.001-0.08-0.001-0.161,0-0.241v-59.907c-0.003-0.13-0.003-0.261,0-0.391V36.463H137.829v188.755 c0.003,0.13,0.003,0.261,0,0.392v59.898c0.001,0.084,0.001,0.168,0,0.252V327.454z M107.84,249.222 c1.563,5.83,5.457,11.66,11.989,17.832v-34.292c-0.822,0.086-1.746,0.256-2.794,0.537c-3.353,0.898-6.156,3.051-7.894,6.061 C107.404,242.369,106.942,245.871,107.84,249.222z M173.576,405.019l-79.363,21.265L18.897,145.209l77.031-20.641 c4.801-1.287,7.651-6.222,6.364-11.023c-1.287-4.801-6.225-7.65-11.022-6.364L10.402,128.85c-3.614,0.968-6.637,3.29-8.512,6.538 c-1.876,3.249-2.376,7.029-1.407,10.644l77.37,288.743c0.968,3.616,3.29,6.641,6.54,8.518c2.166,1.25,4.567,1.89,7,1.89 c1.216,0,2.439-0.16,3.644-0.482l83.199-22.293c4.801-1.287,7.651-6.222,6.364-11.022
					 C183.312,406.581,178.377,403.734,173.576,405.019z M51.298,156.782c-4.801,1.287-7.65,6.222-6.364,11.023l2.217,8.274 c1.078,4.021,4.714,6.673,8.688,6.673c0.771,0,1.555-0.1,2.335-0.309c4.801-1.287,7.65-6.222,6.364-11.023l-2.217-8.274 C61.034,158.344,56.101,155.496,51.298,156.782z M297.52,281.322c-4.971,0-9,4.029-9,9v8.565c0,4.971,4.029,9,9,9s9-4.029,9-9 v-8.565C306.52,285.352,302.491,281.322,297.52,281.322z"/>
								</svg>
								<span className="ml-3"> {gameName} </span>
							</a>
						</li>
					)}
					<li>
						<a href="/game/queue" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
							<svg aria-hidden="true" className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 449.1 449.1" xmlSpace="preserve">
								<path id="XMLID_1208_" d="M106.999,378.491h126.152c4.971,0,9-4.029,9-9s-4.029-9-9-9H115.999v-68.248	c0-37.632,30.616-68.248,68.248-68.248h27.767c37.633,0,68.25,30.616,68.25,68.248V304.1c0,4.971,4.029,9,9,9s9-4.029,9-9v-11.856	c0-33.793-19.536-63.109-47.907-77.248c28.371-14.139,47.907-43.455,47.907-77.248c0,0,0.001-24.301,0-24.387V68.317	c14.811-3.977,25.747-17.52,25.747-33.569C324.011,15.588,308.423,0,289.264,0H106.999C87.838,0,72.25,15.589,72.25,34.75	c0,16.05,10.937,29.593,25.749,33.567v69.43c0,33.793,19.536,63.109,47.906,77.248c-28.37,14.139-47.906,43.455-47.906,77.248v69.43	C83.187,365.647,72.25,379.19,72.25,395.24c0,19.161,15.588,34.749,34.749,34.749h126.152c4.971,0,9-4.029,9-9s-4.029-9-9-9H106.999	c-9.235,0-16.749-7.514-16.749-16.75C90.25,386.004,97.764,378.491,106.999,378.491z M280.264,105.38	c-40.896,3.744-123.284,3.739-164.265-0.002V69.499h164.265V105.38z M90.25,34.748C90.25,25.513,97.764,18,106.999,18h182.265	c9.234,0,16.747,7.514,16.747,16.75c0,9.235-7.513,16.749-16.747,16.749H106.999C97.764,51.499,90.25,43.984,90.25,34.748z	 M115.999,137.747V123.45c42.369,3.688,121.974,3.692,164.265,0.002v14.295c0,37.632-30.617,68.248-68.25,68.248h-27.767	C146.615,205.995,115.999,175.379,115.999,137.747z M207.13,249.212c0,4.971-4.029,9-9,9s-9-4.029-9-9v-2.011c0-4.971,4.029-9,9-9	s9,4.029,9,9V249.212z M199.966,178.497c0-4.971,4.029-9,9-9c12.246,0,23.866-7.131,31.083-19.073	c2.571-4.255,8.103-5.62,12.358-3.049c4.254,2.571,5.618,8.104,3.048,12.358c-10.506,17.385-27.885,27.764-46.489,27.764	C203.995,187.497,199.966,183.468,199.966,178.497z M207.13,293.283v2.012c0,4.971-4.029,9-9,9s-9-4.029-9-9v-2.012	c0-4.971,4.029-9,9-9S207.13,288.313,207.13,293.283z M310.621,404.86c0,4.971-4.029,9-9,9h-1.98c-4.971,0-9-4.029-9-9s4.029-9,9-9	h1.98C306.592,395.86,310.621,399.89,310.621,404.86z M342.062,372.345c0,4.971-4.029,9-9,9h-1.98c-4.971,0-9-4.029-9-9s4.029-9,9-9	h1.98C338.032,363.345,342.062,367.374,342.062,372.345z M357.79,328.105h-82.88c-10.509,0-19.058,8.549-19.058,19.057v82.882	c0,10.507,8.549,19.056,19.058,19.056h82.88c10.51,0,19.06-8.549,19.06-19.056v-82.882C376.85,336.654,368.3,328.105,357.79,328.105	z M358.85,430.044c0,0.563-0.495,1.056-1.06,1.056h-82.88c-0.563,0-1.058-0.493-1.058-1.056v-82.882	c0-0.563,0.494-1.057,1.058-1.057h82.88c0.564,0,1.06,0.494,1.06,1.057V430.044z M342.061,404.86c0,4.971-4.029,9-9,9h-1.981	c-4.971,0-9-4.029-9-9s4.029-9,9-9h1.981C338.031,395.86,342.061,399.89,342.061,404.86z M245.93,269.491v2.012c0,4.971-4.029,9-9,9	s-9-4.029-9-9v-2.012c0-4.971,4.029-9,9-9S245.93,264.521,245.93,269.491z M310.623,372.345c0,4.971-4.029,9-9,9h-1.982	c-4.971,0-9-4.029-9-9s4.029-9,9-9h1.982C306.594,363.345,310.623,367.374,310.623,372.345z M159.331,260.491c4.971,0,9,4.029,9,9	v2.012c0,4.971-4.029,9-9,9s-9-4.029-9-9v-2.012C150.331,264.521,154.36,260.491,159.331,260.491z" />
							</svg>
							<span className="ml-3"> Queue </span>
						</a>
					</li>

					{!isLoggedIn &&
						<div>
							<li>
								<a href="/login" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
									<svg aria-hidden="true" className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd"></path></svg>
									<span className="flex-1 ml-3 whitespace-nowrap">Log in</span>
								</a>
							</li>
							<li>
								<a href="/register" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
									<svg aria-hidden="true" className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z" clipRule="evenodd"></path></svg>
									<span className="flex-1 ml-3 whitespace-nowrap">Register</span>
								</a>
							</li>
						</div>
					}

					{isLoggedIn &&
						<li>
							<a href="/profile" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
								<svg aria-hidden="true" className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
								<span className="flex-1 ml-3 whitespace-nowrap">Profile</span>
							</a>
						</li>
					}

					{isLoggedIn &&
						<li>
							<a href="/logout" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
								<svg className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M768 106V184c97.2 76 160 194.8 160 328 0 229.6-186.4 416-416 416S96 741.6 96 512c0-133.2 62.8-251.6 160-328V106C121.6 190.8 32 341.2 32 512c0 265.2 214.8 480 480 480s480-214.8 480-480c0-170.8-89.6-321.2-224-406z" fill="" /><path d="M512 32c-17.6 0-32 14.4-32 32v448c0 17.6 14.4 32 32 32s32-14.4 32-32V64c0-17.6-14.4-32-32-32z" fill="" /></svg>
								<span className="flex-1 ml-3 whitespace-nowrap">Logout</span>
							</a>
						</li>
					}



				</ul>
			</div>
		</aside>
	)
}

export default Sidebar;
