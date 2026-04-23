<?php

namespace App\Mail;

use App\Models\Laundry;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class LaundryApprovedMail extends Mailable
{
    use Queueable, SerializesModels;

    public Laundry $laundry;

    public function __construct(Laundry $laundry)
    {
        $this->laundry = $laundry;
    }

    public function build()
    {
        return $this->subject('🎉 Your laundry has been approved — Mesbanati')
                    ->view('emails.laundry-approved');
    }
}
