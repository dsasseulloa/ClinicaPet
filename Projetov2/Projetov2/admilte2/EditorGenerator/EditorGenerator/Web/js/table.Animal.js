
/*
 * Editor client script for DB table Animal
 * Created by http://editor.datatables.net/generator
 */

(function($){

$(document).ready(function() {
	var editor = new $.fn.dataTable.Editor( {
		ajax: '/api/Animal',
		table: '#Animal',
		fields: [
			{
				"label": "Nome:",
				"name": "nome"
			},
			{
				"label": "ClienteNome:",
				"name": "clientenome"
			},
			{
				"label": "Sexo:",
				"name": "sexo"
			},
			{
				"label": "Raca:",
				"name": "raca"
			},
			{
				"label": "Tipo:",
				"name": "tipo"
			},
			{
				"label": "Pagamento:",
				"name": "pagamento"
			},
			{
				"label": "Entrada:",
				"name": "entrada",
				"type": "datetime",
				"format": "YYYY-MM-DD"
			},
			{
				"label": "Sangue:",
				"name": "sangue"
			},
			{
				"label": "Pre&ccedil;o:",
				"name": "preco"
			},
			{
				"label": "Idade:",
				"name": "idade"
			}
		]
	} );

	var table = $('#Animal').DataTable( {
		ajax: '/api/Animal',
		columns: [
			{
				"data": "nome"
			},
			{
				"data": "clientenome"
			},
			{
				"data": "sexo"
			},
			{
				"data": "raca"
			},
			{
				"data": "tipo"
			},
			{
				"data": "pagamento"
			},
			{
				"data": "entrada"
			},
			{
				"data": "sangue"
			},
			{
				"data": "preco"
			},
			{
				"data": "idade"
			}
		],
		select: true,
		lengthChange: false
	} );

	new $.fn.dataTable.Buttons( table, [
		{ extend: "create", editor: editor },
		{ extend: "edit",   editor: editor },
		{ extend: "remove", editor: editor }
	] );

	table.buttons().container()
		.appendTo( $('.col-md-6:eq(0)', table.table().container() ) );
} );

}(jQuery));

