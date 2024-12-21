<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Event;

class EventController extends Controller
{
    //
    public function index()
    {
        $events = Event::select('*')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($events);
    }

    public function create_event(Request $request)
    {
        try {
            $request->validate([
                'event_name' => 'string|required',
                'event_description' => 'string|required|max:255',
                'start_date' => 'date|required',
                'end_date' => 'date|required',
                'event_location' => 'string|required',
                'participant_eligibility' => 'string|required',
                'admin_id' => 'integer|required',
            ]);

            $event = new Event();
            $event->event_name = $request->event_name;
            $event->event_description = $request->event_description;
            $event->start_date = $request->start_date;
            $event->end_date = $request->end_date;
            $event->event_location = $request->event_location;
            $event->participant_eligibility = $request->participant_eligibility;
            $event->admin_id = $request->admin_id;

            $event->save();

            return response()->json(
                [
                    'message' => 'Event created successfully',
                    'data' => $event,
                ],
                201
            );
        } catch (\Exception $e) {
            return response()->json(
                [
                    'message' => 'Event creation failed',
                    'error' => $e->getMessage(),
                ],
                500
            );
        }
    }

    public function edit_event(Request $request)
    {
        try {
            $request->validate([
                'event_id' => 'integer|required',
                'event_name' => 'string|required',
                'event_description' => 'string|required|max:255',
                'start_date' => 'date|required',
                'end_date' => 'date|required',
                'event_location' => 'string|required',
                'participant_eligibility' => 'string|required',
                'admin_id' => 'integer|required',
            ]);
            $event = Event::find($request->event_id);

            if (!$event) {
                return response()->json(
                    [
                        'message' => 'Event not found',
                    ],
                    404
                );
            }

            $event->event_name = $request->event_name;
            $event->event_description = $request->event_description;
            $event->start_date = $request->start_date;
            $event->end_date = $request->end_date;
            $event->event_location = $request->event_location;
            $event->participant_eligibility = $request->participant_eligibility;
            $event->admin_id = $request->admin_id;
            $event->save();
            return response()->json(
                [
                    'message' => 'Event updated successfully',
                    'data' => $event,
                ],
                200
            );
        } catch (\Exception $e) {
            return response()->json(
                [
                    'message' => 'Event update failed',
                    'error' => $e->getMessage(),
                ],
                500
            );
        }
    }

    public function delete_event(int $event_id)
    {
        try {
            $event = Event::find($event_id);

            if (!$event) {
                return response()->json(
                    [
                        'message' => 'Event not found',
                    ],
                    404
                );
            }

            $event->delete();
            return response()->json(
                [
                    'message' => 'Event deleted successfully',
                ],
                200
            );
        } catch (\Exception $e) {
            return response()->json(
                [
                    'message' => 'Event deletion failed',
                    'error' => $e->getMessage(),
                ],
                500
            );
        }
    }
}
