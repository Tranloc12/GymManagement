import React, { useEffect, useState, useContext } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import styled from 'styled-components';
import { Alert, Button, Form, Modal, Spinner } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { authApis, endpoints } from '../configs/Apis';
import { MyUserContext } from '../contexts/Contexts';

const localizer = momentLocalizer(moment);

const StyledCalendarContainer = styled.div`
  margin: 20px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  .rbc-calendar {
    height: 100%;
  }

  .rbc-time-view {
    border-radius: 8px;
  }

  .rbc-time-slot {
    border-top: 1px solid #f0f0f0;
  }

  .rbc-event {
    border-radius: 4px;
  }
`;

const CheckboxGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 20px;
`;

const muscleGroups = [
  { value: 'chest', label: 'Ngực' },
  { value: 'back', label: 'Lưng' },
  { value: 'shoulders', label: 'Vai' },
  { value: 'biceps', label: 'Tay trước' },
  { value: 'triceps', label: 'Tay sau' },
  { value: 'legs', label: 'Chân' },
  { value: 'abs', label: 'Bụng' },
  { value: 'cardio', label: 'Cardio' },
  { value: 'fullbody', label: 'Toàn thân' },
];

const Schedule = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [workouts, setWorkouts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState([]);
  const [withTrainer, setWithTrainer] = useState(false);
  const [showSuggestModal, setShowSuggestModal] = useState(false);
  const [suggestedSlot, setSuggestedSlot] = useState(null);
  const [suggestedMuscleGroups, setSuggestedMuscleGroups] = useState([]);
  const [isSuggestingMode, setIsSuggestingMode] = useState(false);
  const [originalEventForSuggestion, setOriginalEventForSuggestion] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = useContext(MyUserContext);

  const { id: subscriptionId } = useParams();

  useEffect(() => {
    const fetchSubscription = async () => {
      setLoading(true);
      try {
        const resp = subscriptionId
          ? await authApis().get(endpoints['subscription'](subscriptionId))
          : await authApis().get(endpoints['my-subscriptions']);
        const subData = subscriptionId ? resp.data : resp.data.find(s => s.isActive);
        setSubscription(subData);
      } catch (e) {
        console.error(e);
        setError('Không thể tải dữ liệu gói tập.');
      } finally {
        setLoading(false);
      }
    };
    fetchSubscription();
  }, [subscriptionId]);

  useEffect(() => {
    if (!subscription?.id) return;
    const load = async () => {
      try {
        const resp = await authApis().get(
          endpoints['workout-by-subscription'](subscription.id)
        );
        // Ensure resp.data is always an array
        const workoutsData = Array.isArray(resp.data) ? resp.data : [];
        setWorkouts(
          workoutsData.map(w => ({
            id: w.id,
            title: w.type,
            start: new Date(w.startTime),
            end: new Date(w.endTime),
            status: w.status,
          }))
        );
      } catch {
        setError('Không tải được lịch tập.');
      }
    };
    load();
  }, [subscription]);

  const refresh = async () => {
    if (!subscription) return;
    const resp = await authApis().get(
      endpoints['workout-by-subscription'](subscription.id)
    );
    // Ensure resp.data is always an array
    const workoutsData = Array.isArray(resp.data) ? resp.data : [];
    setWorkouts(
      workoutsData.map(w => ({ id: w.id, title: w.type, start: new Date(w.startTime), end: new Date(w.endTime), status: w.status }))
    );
  };

  const isValidDate = date => {
    if (!subscription) return false;
    const start = moment(subscription.startDate);
    const end = moment(subscription.endDate);
    return moment(date).isBetween(start, end, null, '[]');
  };

  const handleSelectSlot = ({ start, end }) => {
    if (!isValidDate(start)) return;
    const sh = start.getHours(), eh = end.getHours();
    if (sh < 4 || eh > 22 || (eh === 22 && end.getMinutes() > 0)) return;

    if (isSuggestingMode) {
      // Đang ở chế độ đề xuất lịch khác
      setSuggestedSlot({ start, end });
      setShowSuggestModal(true);
      setIsSuggestingMode(false);
    } else {
      // Chế độ tạo lịch bình thường
      setSelectedSlot({ start, end });
      setSelectedMuscleGroups([]);
      setWithTrainer(false);
      setShowModal(true);
    }
  };

  const handleSelectEvent = event => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  const postWorkout = async (start, end, type, isWithTrainer = false) => {
    const fd = new FormData();
    fd.append('subscriptionId', subscription.id);
    fd.append('startTime', moment(start).format('YYYY-MM-DD HH:mm'));
    fd.append('endTime', moment(end).format('YYYY-MM-DD HH:mm'));
    fd.append('type', type);
    fd.append('isWithTrainer', isWithTrainer);
    const status = user.userRole === 'ROLE_MEMBER' ? 'MEMBER' : 'TRAINER';
    fd.append('status', status);
    await authApis().post(
      endpoints['create-workout'],
      fd,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
  };

  const patchWorkout = async (id, patchData) => {
    console.log("Patch workout", id, patchData);
    const fd = new FormData();
    Object.keys(patchData).forEach(key => {
      fd.append(key, patchData[key]);
    });
    await authApis().patch(
      endpoints['update-workout'](id),
      fd,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    await refresh();
  };

  const deleteWorkout = async id => {
    await authApis().delete(
      endpoints['delete-workout'](id)
    );
    await refresh();
  };

  //Tạo lịch tập lẻlẻ
  const createSingle = async () => {
    if (!selectedSlot || !selectedMuscleGroups.length) return;
    const { start, end } = selectedSlot;
    const type = selectedMuscleGroups.join(',');
    await postWorkout(start, end, type, withTrainer);
    await refresh();
    setShowModal(false);
    setWithTrainer(false);
  };

  //Áp dụng cho tất cả tuầntuần
  const applyAllWeeks = async () => {
    if (!selectedSlot || !selectedMuscleGroups.length) return;
    const baseStart = moment(selectedSlot.start);
    const baseEnd = moment(selectedSlot.end);
    const durationMins = baseEnd.diff(baseStart, 'minutes');
    const type = selectedMuscleGroups.join(',');
    const periodStart = moment(subscription.startDate);
    const periodEnd = moment(subscription.endDate);
    let first = baseStart.clone();
    while (first.clone().subtract(7, 'days').isSameOrAfter(periodStart)) first.subtract(7, 'days');
    const tasks = [];
    let cursor = first.clone();
    while (cursor.isSameOrBefore(periodEnd)) {
      const newEnd = cursor.clone().add(durationMins, 'minutes');
      if (newEnd.isAfter(periodEnd)) break;
      tasks.push(postWorkout(cursor.toDate(), newEnd.toDate(), type, withTrainer));
      cursor.add(7, 'days');
    }
    await Promise.all(tasks);
    await refresh();
    setShowModal(false);
    setWithTrainer(false);
  };

  const approveWorkout = async (id) => {
    console.log("Approve workout", id);
    await authApis().patch(endpoints['approve-workout'](id), {});
    await refresh();
  };

  const handleApprove = async () => {
    await approveWorkout(selectedEvent.id);
    setShowEventModal(false);
  };

  const handleSuggestAlternative = () => {
    setOriginalEventForSuggestion(selectedEvent);
    setSuggestedMuscleGroups(selectedEvent.title.split(','));
    setIsSuggestingMode(true);
    setShowEventModal(false);
  };

  const suggestWorkout = async (start, end, type) => {
    const fd = new FormData();
    fd.append('startTime', moment(start).format('YYYY-MM-DD HH:mm'));
    fd.append('endTime', moment(end).format('YYYY-MM-DD HH:mm'));
    fd.append('type', type);
    await authApis().patch(
      endpoints['suggest-workout'](originalEventForSuggestion.id),
      fd,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
  };

  const handleConfirmSuggestion = async () => {
    if (!suggestedSlot || !suggestedMuscleGroups.length) return;
    const { start, end } = suggestedSlot;
    const type = suggestedMuscleGroups.join(',');
    await suggestWorkout(start, end, type);
    await refresh();
    setShowSuggestModal(false);
    setShowEventModal(false);
  };

  const handleSuggestAllWeeks = async () => {
    if (!suggestedSlot || !suggestedMuscleGroups.length) return;
    const baseStart = moment(suggestedSlot.start);
    const baseEnd = moment(suggestedSlot.end);
    const type = suggestedMuscleGroups.join(',');

    const originalStart = moment(originalEventForSuggestion.start);
    const originalDay = originalStart.day();
    const originalHours = originalStart.hours();
    const originalMinutes = originalStart.minutes();

    const newDay = baseStart.day();
    const dayDifference = newDay - originalDay;

    const toUpdate = workouts.filter(w => {
      const d = moment(w.start);
      return d.day() === originalDay && d.hours() === originalHours && d.minutes() === originalMinutes && w.status === 'MEMBER';
    });

    const tasks = toUpdate.map(w => {
      const workoutDate = moment(w.start);

      const newStart = workoutDate.clone()
        .add(dayDifference, 'days')
        .hours(baseStart.hours())
        .minutes(baseStart.minutes())
        .seconds(0)
        .milliseconds(0);

      const newEnd = workoutDate.clone()
        .add(dayDifference, 'days')
        .hours(baseEnd.hours())
        .minutes(baseEnd.minutes())
        .seconds(0)
        .milliseconds(0);

      const fd = new FormData();
      fd.append('startTime', newStart.format('YYYY-MM-DD HH:mm'));
      fd.append('endTime', newEnd.format('YYYY-MM-DD HH:mm'));
      fd.append('type', type);
      return authApis().patch(
        endpoints['suggest-workout'](w.id),
        fd,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
    });

    await Promise.all(tasks);
    await refresh();
    setShowSuggestModal(false);
    setShowEventModal(false);
  };

  
  const handleRejectSuggestion = () => {
    patchWorkout(selectedEvent.id, { status: 'MEMBER' });
    setShowEventModal(false);
  };

  const handleApproveAllWeeks = async () => {
    const originalStart = moment(selectedEvent.start);
    const day = originalStart.day();
    const hours = originalStart.hours();
    const minutes = originalStart.minutes();

    const toApprove = workouts.filter(w => {
      const d = moment(w.start);
      return d.day() === day && d.hours() === hours && d.minutes() === minutes && w.status === selectedEvent.status;
    });

    console.log("Approve all weeks - found", toApprove.length, "workouts to approve");

    const tasks = toApprove.map(w =>
      authApis().patch(endpoints['approve-workout'](w.id), {})
    );

    await Promise.all(tasks);
    await refresh();
    setShowEventModal(false);
  };

  const handleSuggestDelete = () => {
    const status = user?.userRole === 'ROLE_MEMBER' ? 'MEMBER_DELETE' : 'TRAINER_DELETE';
    patchWorkout(selectedEvent.id, { status });
    setShowEventModal(false);
  };

  const handleAcceptDelete = () => deleteWorkout(selectedEvent.id).then(() => setShowEventModal(false));

  const handleRejectDelete = () => {
    const status = user?.userRole === 'ROLE_MEMBER' ? 'MEMBER' : 'TRAINER';
    patchWorkout(selectedEvent.id, { status });
    setShowEventModal(false);
  };

  const handleDeleteAllWeeks = async () => {
    const { start } = selectedEvent;
    const day = start.getDay();
    const hours = start.getHours();
    const minutes = start.getMinutes();
    const toDelete = workouts.filter(w => {
      const d = w.start;
      return d.getDay() === day && d.getHours() === hours && d.getMinutes() === minutes;
    });
    const tasks = toDelete.map(w => deleteWorkout(w.id));
    await Promise.all(tasks);
    setShowEventModal(false);
  };

  const eventStyle = e => {
    let bg = '#2196F3';
    if (e.status === 'APPROVED') bg = '#4CAF50';
    if (e.status === 'MEMBER') bg = '#CCCCC7';
    if (e.status === 'TRAINER') bg = '#FF9800';
    return { style: { backgroundColor: bg, borderRadius: '4px', color: 'white' } };
  };

  if (loading || !user) return <div className="text-center my-5"><Spinner animation="border" /><p>Đang tải...</p></div>;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!subscription) return <Alert variant="warning">Vui lòng chọn gói tập.</Alert>;

  return (
    <>
      <StyledCalendarContainer>
        <h2 className="text-center mb-4">Lịch tập luyện</h2>
        {isSuggestingMode && (
          <Alert variant="info" className="text-center mb-3">
            <strong>Chế độ đề xuất lịch khác:</strong> Hãy click và kéo trên lịch để chọn thời gian mới cho buổi tập.
          </Alert>
        )}
        <div className="text-center mb-4">
          <p><strong>Gói tập:</strong> {subscription.packageId.name}</p>
          <p><strong>Thời hạn:</strong> {moment(subscription.startDate).format('DD/MM/YYYY')} - {moment(subscription.endDate).format('DD/MM/YYYY')}</p>
          {subscription.remainingSessions && <p><strong>Buổi HLV còn:</strong> {subscription.remainingSessions}</p>}
        </div>
        <Calendar
          localizer={localizer}
          events={workouts}
          startAccessor="start"
          endAccessor="end"
          defaultView="week"
          views={["week"]}
          selectable
          resizable
          date={currentDate}
          onNavigate={setCurrentDate}
          min={new Date(new Date().setHours(4, 0, 0, 0))}
          max={new Date(new Date().setHours(22, 0, 0, 0))}
          step={60}
          timeslots={1}
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          eventPropGetter={eventStyle}
          minDate={new Date(subscription.startDate)}
          maxDate={new Date(subscription.endDate)}
          formats={{ timeGutterFormat: 'HH:mm' }}
        />
      </StyledCalendarContainer>

      {/* Modal: Create */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton><Modal.Title>Tạo lịch tập mới</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Chọn nhóm cơ</Form.Label>
              <CheckboxGroup>{muscleGroups.map(g => (
                <Form.Check key={g.value} type="checkbox" id={g.value} label={g.label}
                  checked={selectedMuscleGroups.includes(g.value)}
                  onChange={() => setSelectedMuscleGroups(prev => prev.includes(g.value)
                    ? prev.filter(x => x !== g.value)
                    : [...prev, g.value])}
                />
              ))}</CheckboxGroup>
            </Form.Group>
            {selectedSlot && (
              <div className="mb-3">
                <p><strong>Bắt đầu:</strong> {moment(selectedSlot.start).format('DD/MM/YYYY HH:mm')}</p>
                <p><strong>Kết thúc:</strong> {moment(selectedSlot.end).format('DD/MM/YYYY HH:mm')}</p>
              </div>
            )}
            <Form.Group className="mb-3">
              <Form.Check type="checkbox" label="Tập cùng HLV"
                checked={withTrainer}
                onChange={e => setWithTrainer(e.target.checked)}
              />
              {withTrainer && subscription.remainingSessions !== undefined && (
                <div className="mt-2">
                  <small className="text-muted">
                    Buổi HLV còn lại: {subscription.remainingSessions}
                    {subscription.remainingSessions <= 0 && (
                      <span className="text-danger"> - Không đủ buổi!</span>
                    )}
                  </small>
                </div>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => {
            setShowModal(false);
            setWithTrainer(false); // Reset withTrainer state
          }}>Hủy</Button>
          <Button variant="warning" onClick={applyAllWeeks} disabled={!selectedMuscleGroups.length || (withTrainer && subscription.remainingSessions <= 0)}>Áp dụng cho tất cả tuần</Button>
          <Button variant="primary" onClick={createSingle} disabled={!selectedMuscleGroups.length || (withTrainer && subscription.remainingSessions <= 0)}>Tạo lịch tập</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal: Event Actions */}
      <Modal show={showEventModal} onHide={() => setShowEventModal(false)}>
        <Modal.Header closeButton><Modal.Title>Quản lý Buổi Tập</Modal.Title></Modal.Header>
        <Modal.Body>
          <p><strong>Thời gian:</strong> {moment(selectedEvent?.start).format('DD/MM/YYYY HH:mm')} - {moment(selectedEvent?.end).format('HH:mm')}</p>
          <div className="d-flex flex-column gap-2">
            {user?.userRole === 'ROLE_MEMBER' && selectedEvent?.status === 'MEMBER' && (
              <>
                <Button variant="danger" onClick={handleAcceptDelete}>Xóa buổi tập</Button>
                <Button variant="danger" onClick={handleDeleteAllWeeks}>Xóa tất cả tuần</Button>
              </>
            )}
            {user?.userRole === 'ROLE_TRAINER' && selectedEvent?.status === 'TRAINER' && (
              <>
                <Button variant="danger" onClick={handleAcceptDelete}>Xóa buổi tập</Button>
                <Button variant="danger" onClick={handleDeleteAllWeeks}>Xóa tất cả tuần</Button>
              </>
            )}
            {user?.userRole === 'ROLE_MEMBER' && selectedEvent?.status === 'TRAINER' && (
              <>
                <Button onClick={handleApprove}>Chấp nhận đề xuất</Button>
                <Button onClick={handleApproveAllWeeks}>Chấp nhận đề xuất & Áp dụng tất cả tuần</Button>
                <Button variant="secondary" onClick={handleRejectSuggestion}>Từ chối đề xuất</Button>
                <Button variant="danger" onClick={handleSuggestDelete}>Đề xuất xóa</Button>
              </>
            )}
            {user?.userRole === 'ROLE_TRAINER' && selectedEvent?.status === 'MEMBER' && (
              <>
                <Button onClick={handleApprove}>Chấp nhận</Button>
                <Button onClick={handleApproveAllWeeks}>Chấp nhận & Áp dụng tất cả tuần</Button>
                <Button variant="warning" onClick={handleSuggestAlternative}>Đề xuất lịch khác</Button>
                <Button variant="danger" onClick={handleSuggestDelete}>Đề xuất xóa</Button>
              </>
            )}
            {/* Deletion workflow */}
            {selectedEvent?.status === 'MEMBER_DELETE' && user?.userRole === 'ROLE_TRAINER' && (
              <>
                <Button onClick={handleAcceptDelete}>Chấp nhận xóa</Button>
                <Button variant="secondary" onClick={handleRejectDelete}>Từ chối xóa</Button>
              </>
            )}
            {selectedEvent?.status === 'TRAINER_DELETE' && user?.userRole === 'ROLE_MEMBER' && (
              <>
                <Button onClick={handleAcceptDelete}>Chấp nhận xóa</Button>
                <Button variant="secondary" onClick={handleRejectDelete}>Từ chối xóa</Button>
              </>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEventModal(false)}>Đóng</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal: Suggest Alternative Schedule */}
      <Modal show={showSuggestModal} onHide={() => setShowSuggestModal(false)}>
        <Modal.Header closeButton><Modal.Title>Đề xuất lịch tập khác</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Chọn nhóm cơ</Form.Label>
              <CheckboxGroup>{muscleGroups.map(g => (
                <Form.Check key={g.value} type="checkbox" id={g.value} label={g.label}
                  checked={suggestedMuscleGroups.includes(g.value)}
                  onChange={() => setSuggestedMuscleGroups(prev => prev.includes(g.value)
                    ? prev.filter(x => x !== g.value)
                    : [...prev, g.value])}
                />
              ))}</CheckboxGroup>
            </Form.Group>
            {suggestedSlot && (
              <div className="mb-3">
                <Form.Group className="mb-2">
                  <Form.Label>Thời gian bắt đầu</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    value={moment(suggestedSlot.start).format('YYYY-MM-DDTHH:mm')}
                    onChange={(e) => {
                      const newStart = new Date(e.target.value);
                      const duration = moment(suggestedSlot.end).diff(moment(suggestedSlot.start), 'minutes');
                      const newEnd = moment(newStart).add(duration, 'minutes').toDate();
                      setSuggestedSlot({ start: newStart, end: newEnd });
                    }}
                  />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Thời gian kết thúc</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    value={moment(suggestedSlot.end).format('YYYY-MM-DDTHH:mm')}
                    onChange={(e) => {
                      const newEnd = new Date(e.target.value);
                      setSuggestedSlot({ ...suggestedSlot, end: newEnd });
                    }}
                  />
                </Form.Group>
              </div>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => {
            setShowSuggestModal(false);
            setIsSuggestingMode(false);
          }}>Hủy</Button>
          <Button variant="warning" onClick={handleSuggestAllWeeks} disabled={!suggestedMuscleGroups.length}>Đề xuất & Áp dụng tất cả tuần</Button>
          <Button variant="primary" onClick={handleConfirmSuggestion} disabled={!suggestedMuscleGroups.length}>Đề xuất lịch này</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Schedule;
