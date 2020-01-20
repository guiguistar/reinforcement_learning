/*
  Naming conventions
    
  Methods starting by draw_ are meant to drawn numbers on the grid. For exemple,
  draw_value_matrix() will put the coefficients of the matrix on the cancas.

  Method starting with reset_ put all the coefficient of a mtrix to 0.

  Methods starting with fill_ paint the cells of the grid.

  Methods starting with clear_ will clear the canvas.
  

  TODO:
  - conflict draw_cell fill_cell
*/

const actions = {
	'UP': 'Up',
	'DOWN': 'Down',
	'LEFT': 'Left',
	'RIGHT': 'Right',
	'NO_MOVE': 'NoMove',
}
const moves = {
	'Up':     [-1, +0],
	'Down':   [+1, +0],
	'Left':   [+0, -1],
	'Right':  [+0, +1],
	'NoMove': [+0, +0],
}
const direction_bit = {
	'UP': 1,
	'RIGHT': 2,
	'DOWN': 4,
	'LEFT': 8,
}

var matrix_test = [[6,10,10,10,12,6,10,10,12,2,10,14,10,14,12,2,14,10,8,6,14,10,10,10,12,6,12,6,14,12],
				   [5,6,10,10,13,5,4,6,9,6,12,3,12,5,3,12,3,10,14,9,3,12,2,12,3,9,5,5,5,1],
				   [5,5,2,10,13,3,13,5,6,9,3,12,5,5,2,11,10,12,1,6,12,5,6,9,6,10,9,1,3,12],
				   [5,5,6,12,3,12,5,3,11,10,8,5,5,3,12,6,12,3,10,9,3,9,7,10,9,2,10,14,12,5],
				   [5,3,9,3,12,5,5,2,12,6,10,9,5,4,3,9,3,12,6,10,14,12,5,6,10,10,12,5,3,9],
				   [5,2,10,12,5,1,3,10,13,5,6,8,3,13,2,12,6,9,5,6,9,5,5,5,4,6,9,5,6,12],
				   [3,12,6,13,3,10,10,10,9,5,5,6,12,5,6,9,5,6,9,5,4,5,3,9,5,5,2,11,9,5],
				   [4,3,9,5,2,10,14,10,12,5,3,9,3,11,13,6,9,3,8,5,5,5,6,10,9,3,12,6,10,9],
				   [7,8,6,9,6,12,5,6,9,5,6,10,10,8,5,5,6,14,10,13,3,11,9,6,10,10,9,7,10,12],
				   [7,10,9,6,9,3,9,5,4,3,9,6,10,12,1,5,1,5,2,9,6,12,6,9,2,10,10,9,6,13],
				   [5,6,14,9,6,10,12,3,13,6,14,9,4,3,12,3,12,5,6,10,9,3,9,2,14,10,10,10,9,5],
				   [5,5,3,10,9,6,9,4,5,1,5,6,11,10,9,6,9,5,3,12,6,12,6,10,9,6,14,8,6,9],
				   [5,3,10,10,12,3,12,7,9,6,9,3,10,12,4,7,12,3,12,3,9,5,3,12,6,13,1,6,9,4],
				   [3,12,6,10,9,6,9,3,10,9,2,12,6,9,3,9,5,6,13,6,8,3,10,9,5,1,6,9,6,13],
				   [6,9,3,10,8,5,6,10,10,10,10,13,3,10,10,12,5,5,3,13,6,14,8,6,11,12,3,10,9,5],
				   [5,6,10,12,6,9,5,6,12,2,10,9,6,10,12,3,9,3,12,5,5,3,12,5,6,11,10,10,12,5],
				   [3,9,6,9,5,6,11,9,5,6,10,12,5,4,7,8,6,14,9,1,3,12,3,9,3,10,12,2,13,5],
				   [6,8,3,10,9,3,10,12,3,9,4,5,3,13,3,12,5,3,10,12,6,9,2,10,14,12,3,12,1,5],
				   [7,10,10,14,10,10,8,5,6,12,5,3,12,3,12,3,9,4,6,9,3,12,6,12,5,3,12,5,6,9],
				   [3,10,8,3,10,10,10,11,9,3,11,8,3,10,11,10,10,9,3,10,10,11,9,3,9,2,9,3,11,8],]

var small_matrix = [[6,8,6,10,14,10,8,6,10,10,10,10,10,10,12,6,14,8,6,12],
					[5,6,9,4,3,10,10,9,6,10,10,10,10,12,3,9,3,10,9,5],
					[7,9,6,11,10,14,12,2,11,10,12,6,12,1,6,10,10,10,10,13],
					[5,4,3,12,4,5,5,6,10,10,13,5,3,10,9,4,6,10,10,9],
					[5,3,12,3,13,5,3,13,2,10,9,7,10,12,6,11,9,6,10,12],
					[3,12,3,14,9,5,2,13,6,10,12,5,4,5,3,12,6,9,4,5],
					[4,3,12,3,12,3,12,5,5,6,9,3,9,3,12,3,9,4,7,9],
					[7,8,5,2,9,6,9,5,5,3,10,10,12,6,9,2,14,9,5,4],
					[5,6,9,6,12,3,12,5,3,10,12,2,13,3,10,12,7,10,9,5],
					[5,5,6,9,3,10,9,3,12,4,3,12,3,12,6,9,5,2,14,13],
					[5,5,3,14,10,10,12,2,11,11,8,3,12,3,9,2,11,12,5,5],
					[5,3,12,5,6,12,3,10,10,12,6,12,3,12,6,12,2,13,1,5],
					[7,10,9,1,5,3,12,6,12,3,9,3,12,5,5,5,4,3,12,5],
					[5,6,10,10,9,4,5,5,3,10,12,6,13,5,5,3,9,4,3,13],
					[3,9,2,10,10,11,11,9,2,10,11,9,1,3,9,2,10,11,10,9],]
class DP {
	constructor(canvas, matrix) {
		this.canvas = canvas; // once
		this.buffer = document.createElement('canvas');
		//this.canvas.parentNode.insertBefore(this.buffer, this.canvas.nextSibling);
		
		this.draw_value_matrix_on = true;
		this.new_maze_animation_on = false;
		this.init_from_matrix(matrix);
		this.attach_listeners();
	}
	init_from_matrix(matrix) {
		this.config = {
			wallWidth: 2,
			pathWidth: 4, // modified by init_sizes
			pathWidthCoeff: 0.1,
			goal_color: 'orange',
			clear_color: 'white',
		}
		
		this.matrix = matrix;
		this.rows = matrix.length;
		this.cols = matrix[0].length;

		this.init_sizes(this.canvas);
		this.init_sizes(this.buffer);

		this.matrix           = matrix;
		this.reward_matrix    = DP.create_matrix(this.rows, this.cols, (i, j) => -1);
		this.value_matrix     = DP.create_matrix(this.rows, this.cols, (i, j) => 0);
		this.new_value_matrix = DP.create_matrix(this.rows, this.cols, (i, j) => 0);
		
		this.draw_grid(this.canvas);
		this.draw_grid(this.buffer);

		//this.clear_grid(this.canvas);
		this.clear_grid(this.buffer);
		
		this.log();

		if(this.new_maze_animation_on) {
			this.remove_grid_and_iterate(0);
		}
		else {
			this.clear_grid(this.canvas);
		}
		
		//this.place_goal_randomly(0);
		this.place_goal(Math.floor(this.rows / 2), Math.floor(this.cols / 2));
		this.repaint();
	}
	init_sizes(canvas, coeff=0.6) {
		let row_step = Math.floor(coeff * window.innerHeight / this.rows);
		let row_cols = Math.floor(coeff * window.innerWidth  / this.cols);
		let context = canvas.getContext('2d');
		
		this.size = Math.min(row_step, row_cols);		

		canvas.width = (this.cols + 2) * this.size;
		canvas.height = (this.rows + 2) * this.size;
		context.lineWidth = this.config.wallWidth;
		context.font = '' + (this.size - 2 * context.lineWidth) / 3 + 'px monospace';	
		context.lineCap = 'round';
			
		this.row_step = this.size;
		this.col_step = this.size;
		
		this.config.pathWidth = Math.floor(this.size * this.config.pathWidthCoeff);
	}
	/* should init be set? */
	init_DOM_goal_coordinates() {
		let i = document.getElementById("i_goal");
		let j = document.getElementById("j_goal");

		i.innerText = this.i_goal;
		j.innerText = this.j_goal;
	}
	/* Dead code */
	init_DOM(){
		function set_checked_radios(radios, id) {
			for(const radio of radios) {
				console.log(radio.id);
				if(radio.id == id) {
					console.log("Id found.");
					radio.checked = true;
				}
			}
		}
		let radios = document.getElementsByName("matrices_options");
		set_checked_radios(radios, "value_option");
	}
	/* Dead code */
	toggle_draw_value_matrix_on() {
		this.draw_value_matrix_on = !this.draw_value_matrix_on;
		this.clear_and_draw_buffer();
		this.fill_value_matrix();
		if(this.draw_value_matrix_on) {
			this.draw_value_matrix();
		}
	}
	fill_after_iterations(n, gamma=1) {
		this.iterations(n, gamma);
		this.clear_and_draw_buffer();
		this.fill_value_matrix();
		this.draw_value_matrix();
	}
	possible_actions(i, j) {
		let actions = ['NoMove'];

		// Ce test est possiblement à sortir de cettte fonction
		if(i < 0 || j < 0 || i >= this.rows || j >= this.cols) {
			return actions;
		}
		
		let digit = this.matrix[i][j];
		
		if(i > 0 && digit & direction_bit.UP) {
			actions.push('Up');
		}
		if(i + 1 < this.rows && digit & direction_bit.DOWN) {
			actions.push('Down');
		}
		if(j > 0 && digit & direction_bit.LEFT) {
			actions.push('Left');
		}
		if(j + 1 < this.cols && digit & direction_bit.RIGHT) {
			actions.push('Right');
		}
		
		return actions;
	}
	maximum_value(i, j, gamma) {
		let actions = this.possible_actions(i, j);
		let that = this;
		
		let values = actions.map(function(action) {
			let [I, J] = that.transition_function(i, j, action);
			return that.reward_matrix[i][j] + gamma * that.value_matrix[I][J];
		});
		
		return Math.max(...values);
	}	
	transition_function(i, j, action) {
		let res_i = i;
		let res_j = j;

		switch(action) {
		case actions.UP:
			res_i -= 1;
			break;
		case actions.DOWN:	
			res_i += 1;
			break;
		case actions.LEFT:
			res_j -= 1;
			break;
		case actions.RIGHT:
			res_j += 1;
			break;
		case actions.NO_MOVE:
			break;
		default:
			break;
		}

		return [res_i, res_j];
	}
	
	draw_grid(canvas) {
		let context = canvas.getContext('2d');
		// Horizontal lines
		for(let i = 1; i < this.rows+2; i++) {
			context.moveTo(this.col_step, i*this.row_step);
			context.lineTo(canvas.width-this.col_step, i*this.row_step);
			context.stroke();
		}
		// Vertical lines
		for(let j = 1; j < this.cols+2; j++) {
			context.moveTo(j*this.col_step, this.row_step);
			context.lineTo(j*this.col_step, canvas.height-this.row_step);
			context.stroke();
		}
	}
	draw_goal() {
		this.draw_cell(this.i_goal, this.j_goal, this.config.goal_color);
	}
	draw_cell(i, j, color) {
		let context = this.canvas.getContext('2d');
		let style = context.fillStyle;
		
		context.fillStyle = color;
		context.fillRect((j+1) * this.col_step + context.lineWidth / 2,
						  (i+1) * this.row_step + context.lineWidth / 2,
						  this.col_step - context.lineWidth,
						  this.row_step - context.lineWidth);
		context.fillStyle = style;
	}
	draw_value_matrix() {
		this.draw_matrix(this.value_matrix);
	}
	draw_reward_matrix() {
		this.draw_goal();
		this.draw_matrix(this.reward_matrix, 1.7, 1.25);
	}
	draw_matrix(matrix, di=1.7, dj=1.15) {
		let n = matrix.length;
		let p = matrix[0].length;
		let context = this.canvas.getContext('2d');
		
		for(let i = 0; i < n; i++) {
			for(let j = 0; j < p; j++) {
				let value = matrix[i][j];
				context.fillText(value, (j+dj) * this.col_step, (i+di) * this.row_step);
			}
		}
	}
	fill_top(canvas, i, j, color)    { this.clear_line_with_rect(canvas, i, j, 0, -1, color); }
	fill_bottom(canvas, i, j, color) { this.clear_line_with_rect(canvas, i, j, 1, -1, color); }
	fill_left(canvas, i, j, color)   { this.clear_line_with_rect(canvas, i, j, 0,  0, color); }
	fill_right(canvas, i, j, color)  { this.clear_line_with_rect(canvas, i, j, 0,  1, color); }
	
	clear_line_with_rect(canvas, i, j, bottom, right, color) {
		let context = canvas.getContext('2d');
		let style = context.fillStyle;
		context.fillStyle = color

		let w = context.lineWidth;
		let h = w;

		let vertical = right != -1 ? 1 : 0;

		/*
		 * the fillRect cover the rect + the strokeline according to the bottom
		 * and right variables.
		 */
		context.fillRect((j+1+vertical*right) * this.row_step + w/2 - vertical * w,
						 (i+1+bottom) * this.col_step + h/2 - (1-vertical) * h,
						 w + (1-vertical) * (this.col_step - 2 * w),
						 h + vertical * (this.row_step -2 * h));
		
		context.fillStyle = style;
	}
	fill_digit(canvas, i, j, color) {
		//console.log(i, j);
		//console.log(this.matrix[i][j]);
		let digit = this.matrix[i][j];
		
 		if(digit & direction_bit.UP) {
			this.fill_top(canvas, i, j, color);
		}
 		if(digit & direction_bit.RIGHT) {
			this.fill_right(canvas, i, j, color);
		}
 		if(digit & direction_bit.DOWN) {
			this.fill_bottom(canvas, i, j, color);
		}
 		if(digit & direction_bit.LEFT) {
			this.fill_left(canvas, i, j, color);
		}
	}
	fill_value_matrix() {
		let context = this.canvas.getContext('2d');
		context.lineWidth = this.config.wallWidth;

		for(let i = 0; i < this.rows; i++) {
			for(let j = 0; j < this.cols; j++) {
				let color = DP.compute_color_from_value(this.value_matrix[i][j]);
				this.draw_cell(i, j, color);
				this.fill_digit(this.canvas, i, j, color);
			}
		}
	}
	fill_reward_matrix() {
		let context = this.canvas.getContext('2d');

		for(let i = 0; i < this.rows; i++) {
			for(let j = 0; j < this.cols; j++) {
				let color = DP.compute_color_from_value(50 * this.reward_matrix[i][j]);
				this.draw_cell(i, j, color);
				this.fill_digit(this.canvas, i, j, color);
			}
		}
	}
	/* Not pure
	 * Depend on this.rows, this.cols
	 * Modify this.new_value_matrix
	 */
	iteration(gamma=1) {
		for(let i = 0; i < this.rows; i++) {
			for(let j = 0; j < this.cols; j++) {
				this.new_value_matrix[i][j] = this.maximum_value(i, j, gamma);
			}
		}
	}
	iterations(n, gamma=1) {
		for(let i = 1; i <= n; i++) {
			DP.copy_matrix(this.new_value_matrix, this.value_matrix);
			this.iteration(gamma);
		}
	}
	converge() {
		let I = 0;
		this.iteration(1);
		while(!DP.equal_matrix(this.value_matrix, this.new_value_matrix)) {
			DP.copy_matrix(this.new_value_matrix, this.value_matrix);
			this.iteration(1);
			I++;
		}
		return I;
	}
	fill_until_converge() {
		let counter = 0;
		let that = this;
		
		function helper() {
			counter++;
			that.iteration(1);
		
			that.fill_value_matrix();
			if(that.draw_value_matrix_on) {
				that.draw_value_matrix();
			}

			let eq = DP.equal_matrix(that.value_matrix, that.new_value_matrix);
			
			if(!eq) {
				DP.copy_matrix(that.new_value_matrix, that.value_matrix);
				that.animation_request = requestAnimationFrame(helper);
			}
			else {
				console.log( (counter - 1) + " iterations before convergence.");
			}
		}

		this.animation_request = requestAnimationFrame(helper);
	}
	fill_path_to_goal_from(i, j) {
		let that = this;
		let current_i = i;
		let current_j = j;

		let context = this.canvas.getContext('2d');
		let sStyle = context.strokeStyle;

		console.log(sStyle);
		
		context.lineWidth = this.config.pathWidth;

		if(!DP.equal_matrix(this.value_matrix, this.new_value_matrix)
		   || DP.is_zero_matrix(this.new_value_matrix)) {
			alert("Il faut d'abord faire converger l'algorithme.");
			return;
		}
		else {
			console.log("L'algorithme a convergé.");
		}
		
		function helper() {
			//console.log('(i,j)=' + '(' + i + ',' + j + ')');
			let current_x = (current_j + 1.5) * that.col_step;
			let current_y = (current_i + 1.5) * that.row_step;

			let [new_i, new_j] = that.maximum_neighbor(that.value_matrix, current_i, current_j);
			let new_x = (new_j + 1.5) * that.col_step;
			let new_y = (new_i + 1.5) * that.row_step;

			let context = that.canvas.getContext('2d');
			context.strokeStyle = DP.compute_color_from_value(that.value_matrix[new_i][new_j] + 180, 1);
			//context.fillRect(j, i, 5, 5);
			context.beginPath();
			context.moveTo(current_x, current_y);
			context.lineTo(new_x, new_y);
			context.stroke();
			//context.fillText(that.value_matrix[current_i][current_j], (current_j+1.5)*that.col_step, (current_i+0.5)*that.row_step, 10, 10);
			if( current_i != that.i_goal || current_j != that.j_goal) {
				current_i = new_i;
				current_j = new_j;
				requestAnimationFrame(helper);
			}
			else {
				//context.lineWidth = that.config.wallWidth;
				//context.strokeStyle = sStyle;
				that.stop_animation();
			}
		}
		this.animation_request = requestAnimationFrame(helper);
	}
	maximum_neighbor(matrix, i, j) {
		let actions = this.possible_actions(i, j);
		let values = [];
		for(let k = 0; k < actions.length; k++) {
			let [di, dj] = moves[actions[k]];
			let I = i+di;
			let J = j+dj;
			values.push([this.value_matrix[I][J], I, J]);
		}
		values.sort((a, b) => b[0] - a[0]);
		//console.log(values);
		let max = values[0];
		
		return [max[1], max[2]];
	}
	stop_animation () {
		cancelAnimationFrame(this.animation_request);
	}
	// For animated maze creation
	remove_grid_and_iterate(counter = 0) {
		let j = counter % this.cols;
		let i = (counter - j) / this.cols;

		//console.log(this.rows, this.cols, i, j, counter);

		for(let k = 0; k < this.cols; k++) {
			this.fill_digit(this.canvas, i, k, this.config.clear_color);
		}
		
		if(counter < (this.rows-1) * this.cols) {
			requestAnimationFrame(() => this.remove_grid_and_iterate(counter + this.cols));
		}
	}
	place_goal(i, j) {
		if(i >= 0 && i < this.rows && j >= 0 && j <= this.cols) {
			this.i_goal = i;
			this.j_goal = j;
			this.reward_matrix[i][j] = 0;

			this.init_DOM_goal_coordinates();
		}
		else {
			console.log("Error during goal placement.");
		}
	}
	place_goal_randomly(value = 0) {
		let i = Math.floor(Math.random() * this.rows);
		let j = Math.floor(Math.random() * this.cols);

		console.log("Random goal: ", this.i_goal, this.j_goal);
		this.place_goal(i, j);
	}
	clear_and_draw_buffer() {
		DP.clear_canvas(this.canvas);
		this.canvas.getContext('2d').drawImage(this.buffer, 0, 0);
	}
	clear_grid(canvas) {
		let context = canvas.getContext('2d');
		
		for(let i = 0; i < this.rows; i++) {
			for(let j = 0; j < this.cols; j++) {
				this.fill_digit(canvas, i, j, this.config.clear_color);
			}
		}
	}
	reset_value_matrix() {
		DP.reset_matrix(this.value_matrix);
	}
	reset_all() {
		DP.reset_matrix(this.value_matrix);
		DP.reset_matrix(this.new_value_matrix);
		DP.reset_matrix(this.reward_matrix, -1);
	}
	log() {
		console.log(this.canvas);
		console.log(this.canvas.width, this.canvas.height);
		console.log("rows: ", this.rows, ", cols: ", this.cols);
		console.log("row_step: ",this.row_step, ", col_step: ", this.col_step);
	}
	action_one(i, j) {
		this.reset_all();
		this.place_goal(i, j);
		this.stop_animation();
		this.fill_until_converge();
	}
	action_two(i, j) {
		console.log("i: " + i + " j: " + j);
		console.log("value: " + this.value_matrix[i][j]);
		console.log("reward: " + this.reward_matrix[i][j]);
		console.log("maximum: " + this.maximum_value(i, j, 1));
	}
	action_three(i, j) {
		this.reset_all();
		this.clear_and_draw_buffer();
		this.place_goal_randomly();
		this.draw_goal();
		this.converge();
		//this.draw_reward_matrix();
		//this.fill_value_matrix();
		this.fill_path_to_goal_from(i, j);
	}
	coordinates_from_mouse_event(event) {
		const rect = this.canvas.getBoundingClientRect();
		const x = -1 + Math.floor((event.clientX - rect.left) / this.col_step);
		const y = -1 + Math.floor((event.clientY - rect.top) / this.row_step);

		return [x, y]
	}
	/* Must be purified */
	attach_listeners() {
		let that = this;
		this.canvas.addEventListener('mousedown', function(event) {
			let [x, y] = that.coordinates_from_mouse_event(event);
			let start_point = document.getElementById('start_point_option');
			let end_point = document.getElementById('end_point_option');

			if(start_point.checked) {
				console.log('Start point mode');
				
				that.action_two(y, x);
				that.repaint();
				that.fill_path_to_goal_from(y, x);
				
				console.log(that.possible_actions(y, x));
				console.log(that.maximum_neighbor(that.value_matrix, y, x));
			}
			else if(end_point.checked) {
				console.log('End point mode.');

				DP.reset_matrix(that.reward_matrix, -1);
				DP.reset_matrix(that.value_matrix, 0);
				DP.reset_matrix(that.new_value_matrix, 0);

				that.place_goal(y, x);
					
				that.repaint();
			}
		});
		this.canvas.addEventListener('mousemove', function(event) {
			let x_span = document.getElementById('j_mouse');
			let y_span = document.getElementById('i_mouse');
			let [x, y] = that.coordinates_from_mouse_event(event);

			//let mi_i = document.getElementById("mi_i_value");
			//let mi_j = document.getElementById("mi_j_value");

			let mi_i = document.getElementsByClassName("mi_i");
			let mi_j = document.getElementsByClassName("mi_j");
			
			let mi_possible_actions = document.getElementById("mi_possible_actions");
			let array_possible_actions = that.possible_actions(y, x);
			
			x_span.innerText = x;
			y_span.innerText = y;

			//mi_i.innerHTML = y;
			//mi_j.innerHTML = x;
			/*
			for(let mi of mi_i) {
				mi.innerHTML = y;
			}
			for(let mi of mi_j) {
				mi.innerHTML = x;
			}
			*/
			console.log(array_possible_actions.join(","));
			//mi_possible_actions.textContent = array_possible_actions.join(",");
		});
	}
	request_json_maze(rows=15, cols=20) {
		let request = new XMLHttpRequest();
		let url = "http://www.lespursetdurs.fr/maze/?rows=" + rows + "&cols=" + cols +"&json";
		let that = this;

		console.log(url);
		
		request.open("GET", url, true);
		request.responseType = "text";
		request.onload = function(e) {
			let matrix = JSON.parse(request.response);
			that.init_from_matrix(matrix);
			console.log(that.matrix);
		}
		request.send();	
	}
	repaint() {
		let matrices_radios = document.getElementsByName("matrices_options");
		let draw_checked = document.getElementById("draw_checked_input");

		let context = this.canvas.getContext('2d');
		console.log("Repaint!");
		console.log(context.fillStyle, context.strokeStyle, context.lineWidth);
		
		context.lineWidth = this.config.wallWidth;
		
		this.clear_and_draw_buffer();

		for(const radio of matrices_radios) {
			if(radio.checked) {
				radio.parentNode.classList.add("active");
				if(radio.id == "value_option") {
					this.fill_value_matrix();
					if(draw_checked.checked) {
						this.draw_value_matrix();
					}
				}
				if(radio.id == "reward_option") {
					this.fill_reward_matrix();
					if(draw_checked.checked) {
						this.draw_reward_matrix();
					}
				}
				if(radio.id == "none_option") {
				}
			}
			else {
				radio.parentNode.classList.remove("active");
			}
		}
	}
	
	// static method
	static is_zero_matrix(matrix) {
		for(let i = 0; i < matrix.length; i++) {
			for(let j = 0; j < matrix[0].length; j++) {
				if(!matrix[i][j] == 0) {
					return false;
				}
			}
		}
		return true;
	}
	static copy_matrix(src, dst) {
		let n = src.length;
		
		for(let i = 0; i < n; i++) {
			dst[i] = src[i].slice();
		}
	}
	static clear_canvas(canvas) {
		let ctx = canvas.getContext('2d');
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	}
	static create_matrix(n, p, f) {
		let matrix = []
		for(let i = 0; i < n; i++) {
			matrix.push([]);
			for(let j = 0; j < p; j++) {
				matrix[i].push(f(i, j));
			}
		}
		return matrix;
	}	
	static compute_color_from_value(value, alpha=1) {
		//let color = 'hsl(240, 80%, ' + (100 + 0.5 * this.value_matrix[i][j]) + '%)';
		let color = 'hsla(' + (360 - value) + ', 60%, 50%, ' + alpha +')';

		return color;
	}
	static reset_matrix(matrix, coeff = 0) {
		let n = matrix.length;
		let p = matrix[0].length;
		for(let i = 0; i < n; i++) {
			// is that clear?
			matrix[i].forEach( function(value, index){ this[index] = coeff; },
							   matrix[i]);
		}
	}
	static equal_matrix(m1, m2, epsilon = 0.1) {
		let n = m1.length;
		let p = m1[0].length;

		if(n !=  m2.length || p != m2[0].length) {
			return false;
		}
		for(let i = 0; i < n; i++) {
			for(let j = 0; j < p; j++) {
				if(Math.abs(m1[i][j] - m2[i][j]) > epsilon) {
					return false;
				}
			}
		}
		return true;
	}
	static min(matrix) {
		return Math.min(...matrix.map(row => Math.min(...row)))
	}
}

var canvas = document.getElementById('main_canvas');
var iter = new DP(canvas, small_matrix);

//var test_canvas = document.getElementById('test_canvas');
//var iter2 = new DP(test_canvas, matrix_test);

var controller = {
	"new_maze_button": document.getElementById("new_maze_button"),
	"rows_input": document.getElementById("rows_input"),
	"cols_input": document.getElementById("cols_input"),
	"new_maze_animation": document.getElementById("new_maze_animation"),
	"matrices_options_group": document.getElementById("matrices_options_group"),
	"draw_checked_input": document.getElementById("draw_checked_input"),
	"iteration_number_input": document.getElementById("iteration_number_input"),
	"converge_button": document.getElementById("converge_button"),
	"iteration_button": document.getElementById("iteration_button"),
	"mouse_options_group": document.getElementById("mouse_options_group"),
}
controller.new_maze_button.addEventListener("click", function(e) {
	e.preventDefault();
	let r = parseInt(controller.rows_input.value);
	let c = parseInt(controller.cols_input.value);
	console.log("r: " + r + ", c: " + c);
	iter.request_json_maze(r, c);
});
if(! typeof new_maze_animation === 'undefined') {
	controller.new_maze_animation.addEventListener("change", function(e) {
		iter.new_maze_animation_on = this.checked;
	});
}
controller.matrices_options_group.addEventListener("click", function(e) {
	iter.repaint();
});
controller.draw_checked_input.addEventListener("change", function(e) {
	iter.draw_value_matrix_on = this.checked;
	iter.repaint();
});
controller.converge_button.addEventListener("click", function(e) {
	e.preventDefault();
	iter.fill_until_converge();
});
controller.iteration_button.addEventListener("click", function(e) {
	e.preventDefault();
	let i = parseInt(controller.iteration_number_input.value);
	iter.iterations(i);

	iter.repaint();
});
controller.mouse_options_group.addEventListener("click", function(e) {
	let mouse_radios = document.getElementsByName("mouse_options");

	for(const radio of mouse_radios) {
		if(radio.checked) {
			radio.parentNode.classList.add("active");
		}
		else {
			radio.parentNode.classList.remove("active");
		}
	}
	iter.repaint();
});
