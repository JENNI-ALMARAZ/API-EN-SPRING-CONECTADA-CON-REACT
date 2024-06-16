import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';

const ListEstudiantesComponent = () => {
    const [estudiantes, setEstudiantes] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [nombreJUgador, setNombreJugador] = useState('');
    const [equipoActual, setEquipoActual] = useState('');
    const [costoCarta, setCostoCarta] = useState('');
    const [id, setId] = useState('');
    const [editarForm, setEditarForm] = useState(false);
    const [jugadorSeleccionado, setJugadorSeleccionado] = useState(null);

    useEffect(() => {
        getAllEstudiantes();
    }, []);

    const getAllEstudiantes = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api-draftesji/ver-todosJugadores');
            console.log('Jugadores obtenidos:', response.data);
            setEstudiantes(response.data);
        } catch (error) {
            console.error('Error al obtener jugadores:', error);
        }
    };

    const validarCostoCarta = () => {
        if (parseFloat(costoCarta) < 0) {
            return false;
        }
        return true;
    };

    const registrarEstudiante = async (evt) => {
        evt.preventDefault();
        if (!nombreJUgador.trim() || !equipoActual.trim() || !costoCarta.trim()) {
            Swal.fire({
                title: "Error al registrar estudiante",
                text: "Todos los campos son obligatorios",
                icon: "error"
            });
            return;
        }
        if (!validarCostoCarta()) {
            Swal.fire({
                title: "Error",
                text: "El costo no puede ser negativo",
                icon: "error"
            });
            return;
        }
        Swal.fire({
            title: "¿Estás seguro?",
            text: "¿Quieres registrar a este estudiante?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, registrar"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const nuevoEstudiante = { nombreJUgador, equipoActual, costoCarta };
                    const response = await axios.post('http://localhost:8080/api-draftesji/registrar-jugador', nuevoEstudiante);
                    setEstudiantes([...estudiantes, response.data]);
                    setNombreJugador('');
                    setEquipoActual('');
                    setCostoCarta('');
                    setShowForm(false);
                    Swal.fire({
                        title: "Guardado",
                        text: "Estudiante registrado correctamente",
                        icon: "success"
                    });
                } catch (error) {
                    console.error('Error al registrar estudiante:', error);
                    Swal.fire({
                        title: "Error",
                        text: "Hubo un problema al registrar el estudiante",
                        icon: "error"
                    });
                }
            }
        });
    };

    const editarEstudianteOk = async (evt) => {
        evt.preventDefault();
        if (!nombreJUgador.trim() || !equipoActual.trim() || !(costoCarta.toString().trim())){
            Swal.fire({
                title: "Error al actualizar información",
                text: "Todos los campos son obligatorios",
                icon: "error"
            });
            return;
        }
        if (!validarCostoCarta()) {
            Swal.fire({
                title: "Error",
                text: "El costo no puede ser negativo",
                icon: "error"
            });
            return;
        }
        Swal.fire({
            title: "¿Estás seguro?",
            text: "¿Quieres actualizar la información de este estudiante?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, actualizar"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const estudianteEditado = { id, nombreJUgador, equipoActual, costoCarta };
                    await axios.put(`http://localhost:8080/api-draftesji/actualizar-jugador/${id}`, estudianteEditado);
                    setEstudiantes(estudiantes.map(est => est.id === id ? estudianteEditado : est));
                    setNombreJugador('');
                    setEquipoActual('');
                    setCostoCarta('');
                    setId('');
                    setEditarForm(false);
                    setShowForm(false);
                    Swal.fire({
                        title: "Actualizado",
                        text: "Estudiante actualizado correctamente",
                        icon: "success"
                    });
                } catch (error) {
                    console.error('Error al actualizar estudiante:', error);
                    Swal.fire({
                        title: "Error",
                        text: "Hubo un problema al actualizar el estudiante",
                        icon: "error"
                    });
                }
            }
        });
    };

    

    const deleteEstudiante = async (id) => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "No podrás revertir esta acción",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, eliminar"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`http://localhost:8080/api-draftesji/eliminarJugador/${id}`);
                    setEstudiantes(estudiantes.filter(est => est.id !== id));
                    Swal.fire({
                        title: "Eliminado",
                        text: "Estudiante eliminado correctamente",
                        icon: "success"
                    });
                } catch (error) {
                    console.error('Error al eliminar estudiante:', error);
                    Swal.fire({
                        title: "Error",
                        text: "Hubo un problema al eliminar el estudiante",
                        icon: "error"
                    });
                }
            }
        });
    };

    const cancelarAccion = () => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "No se guardarán los cambios",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                setNombreJugador('');
                setEquipoActual('');
                setCostoCarta('');
                setId('');
                setEditarForm(false);
                setShowForm(false);
            }
        });
    };

    const editarEstudiante = (estudiante) => {
        setEditarForm(true);
        setNombreJugador(estudiante.nombreJUgador);
        setEquipoActual(estudiante.equipoActual);
        setCostoCarta(estudiante.costoCarta);
        setId(estudiante.id);
        setShowForm(true);
    };

    return (
        <div className="container my-4">
            <h2 className="text-center mb-4">Estudiantes Registrados</h2>
            {!showForm && (
                <button className="btn btn-success mb-4" onClick={() => setShowForm(true)}>
                    Nuevo Registro
                </button>
            )}
            {!showForm ? (
                <table className="table table-hover table-bordered">
                    <thead className="thead-dark">
                        <tr>
                            <th>Matrícula</th>
                            <th>Nombre del Estudiante</th>
                            <th>Curso</th>
                            <th>Costo</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {estudiantes.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-center">No hay estudiantes registrados</td>
                            </tr>
                        ) : (
                            estudiantes.map(estudiante => (
                                <tr key={estudiante.id}>
                                    <td>{estudiante.id}</td>
                                    <td>{estudiante.nombreJUgador}</td>
                                    <td>{estudiante.equipoActual}</td>
                                    <td>${estudiante.costoCarta}</td>
                                    <td>
                                        <button onClick={() => editarEstudiante(estudiante)} className="btn btn-info btn-sm mr-2">Editar</button>
                                        <button onClick={() => deleteEstudiante(estudiante.id)} className="btn btn-danger btn-sm">Eliminar</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            ) : (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{editarForm ? 'Actualizar Estudiante' : 'Registrar Estudiante'}</h5>
                                <button type="button" className="close" onClick={cancelarAccion}>&times;</button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={editarForm ? editarEstudianteOk : registrarEstudiante}>
                                    <div className="form-group">
                                        <input
                                            type="text"
                                            placeholder="Nombre del Estudiante"
                                            className="form-control"
                                            onChange={(evt) => setNombreJugador(evt.target.value)}
                                            value={nombreJUgador}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <input
                                            type="text"
                                            placeholder="Curso"
                                            className="form-control"
                                            onChange={(evt) => setEquipoActual(evt.target.value)}
                                            value={equipoActual}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <input
                                            type="number"
                                            placeholder="Costo"
                                            className="form-control"
                                            onChange={(evt) => setCostoCarta(evt.target.value)}
                                            value={costoCarta}
                                        />
                                    </div>
                                    
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" onClick={cancelarAccion}>Cancelar</button>
                                        <button type="submit" className="btn btn-primary">
                                            {editarForm ? 'Actualizar Estudiante' : 'Registrar Estudiante'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ListEstudiantesComponent;